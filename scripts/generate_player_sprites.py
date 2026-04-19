#!/usr/bin/env python3

from __future__ import annotations

import math
import struct
import zlib
from copy import deepcopy
from pathlib import Path


LOGICAL_SIZE = 24
SCALE = 2
OUTPUT_DIR = Path("assets/sprites/player")

TRANSPARENT = (0, 0, 0, 0)
OUTLINE = (18, 16, 26, 255)
SKIN = (232, 194, 164, 255)
SKIN_SHADE = (205, 164, 136, 255)
HAIR = (34, 50, 70, 255)
HAIR_LIGHT = (61, 93, 126, 255)
COAT = (52, 86, 118, 255)
COAT_LIGHT = (84, 128, 161, 255)
PANTS = (68, 78, 96, 255)
PANTS_LIGHT = (96, 108, 128, 255)
BOOTS = (86, 56, 46, 255)
METAL = (184, 203, 218, 255)
METAL_SHADOW = (128, 151, 170, 255)
BRASS = (194, 154, 78, 255)
SCARF = (183, 68, 70, 255)
SCARF_LIGHT = (220, 96, 95, 255)
SATCHEL = (120, 84, 52, 255)
SHARD = (118, 225, 236, 255)
SHARD_LIGHT = (176, 248, 255, 255)


def blank_canvas(width=LOGICAL_SIZE, height=LOGICAL_SIZE):
    return [[TRANSPARENT for _ in range(width)] for _ in range(height)]


def clone(canvas):
    return [row[:] for row in canvas]


def put(canvas, x, y, color):
    if 0 <= x < len(canvas[0]) and 0 <= y < len(canvas):
        canvas[y][x] = color


def fill_rect(canvas, x, y, width, height, color):
    for yy in range(y, y + height):
        for xx in range(x, x + width):
            put(canvas, xx, yy, color)


def fill_ellipse(canvas, cx, cy, rx, ry, color):
    for yy in range(cy - ry - 1, cy + ry + 2):
        for xx in range(cx - rx - 1, cx + rx + 2):
            if ((xx - cx) ** 2) / max(rx * rx, 1) + ((yy - cy) ** 2) / max(ry * ry, 1) <= 1:
                put(canvas, xx, yy, color)


def thick_line(canvas, start, end, color, thickness=2):
    x0, y0 = start
    x1, y1 = end
    steps = max(abs(x1 - x0), abs(y1 - y0), 1)
    radius = max(thickness - 1, 0)
    for step in range(steps + 1):
        t = step / steps
        x = round(x0 + (x1 - x0) * t)
        y = round(y0 + (y1 - y0) * t)
        for yy in range(y - radius, y + radius + 1):
            for xx in range(x - radius, x + radius + 1):
                if abs(xx - x) + abs(yy - y) <= radius + 1:
                    put(canvas, xx, yy, color)


def thick_polyline(canvas, points, color, thickness=2):
    for start, end in zip(points, points[1:]):
        thick_line(canvas, start, end, color, thickness)


def add_outline(canvas):
    outlined = clone(canvas)
    height = len(canvas)
    width = len(canvas[0])
    for y in range(height):
        for x in range(width):
            if canvas[y][x][3] == 0:
                neighbors = (
                    (x - 1, y),
                    (x + 1, y),
                    (x, y - 1),
                    (x, y + 1),
                    (x - 1, y - 1),
                    (x + 1, y - 1),
                    (x - 1, y + 1),
                    (x + 1, y + 1),
                )
                for nx, ny in neighbors:
                    if 0 <= nx < width and 0 <= ny < height and canvas[ny][nx][3] != 0:
                        outlined[y][x] = OUTLINE
                        break
    return outlined


def upscale(canvas, scale=SCALE):
    height = len(canvas)
    width = len(canvas[0])
    scaled = blank_canvas(width * scale, height * scale)
    for y in range(height):
        for x in range(width):
            color = canvas[y][x]
            for yy in range(scale):
                for xx in range(scale):
                    scaled[y * scale + yy][x * scale + xx] = color
    return scaled


def png_chunk(tag, data):
    return (
        struct.pack(">I", len(data))
        + tag
        + data
        + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    )


def save_png(canvas, path):
    height = len(canvas)
    width = len(canvas[0])
    raw = bytearray()
    for row in canvas:
        raw.append(0)
        for r, g, b, a in row:
            raw.extend((r, g, b, a))

    png = bytearray(b"\x89PNG\r\n\x1a\n")
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    png.extend(png_chunk(b"IHDR", ihdr))
    png.extend(png_chunk(b"IDAT", zlib.compress(bytes(raw), level=9)))
    png.extend(png_chunk(b"IEND", b""))
    path.write_bytes(bytes(png))


def offset_point(point, origin):
    return point[0] + origin[0], point[1] + origin[1]


def offset_points(points, origin):
    return [offset_point(point, origin) for point in points]


def mirrored_points(points):
    return [(-x, y) for x, y in points]


def base_pose():
    return {
        "root": (0, 0),
        "head": (0, 0),
        "back_arm": [(-1, 1), (-2, 5)],
        "front_arm": [(1, 1), (2, 6)],
        "back_leg": [(-1, 3), (-1, 8)],
        "front_leg": [(1, 3), (1, 8)],
        "scarf": [(-2, 1), (-4, 2)],
        "cape": [(-1, 0), (-2, 2), (2, 2)],
        "coat_flare": 0,
        "lean": 0,
        "weapon": None,
        "hurt_flash": False,
        "fallen": False,
        "shard": True,
    }


def merge_pose(**overrides):
    pose = deepcopy(base_pose())
    for key, value in overrides.items():
        pose[key] = value
    return pose


def torso_geometry(pose):
    root_x, root_y = pose["root"]
    lean = pose["lean"]
    torso_center = (12 + root_x + lean, 12 + root_y)
    hip_center = (12 + root_x, 15 + root_y)
    return torso_center, hip_center


def draw_head(canvas, pose, torso_center):
    head_dx, head_dy = pose["head"]
    center = (torso_center[0] + head_dx, torso_center[1] - 7 + head_dy)
    fill_ellipse(canvas, center[0], center[1], 3, 4, SKIN)
    fill_ellipse(canvas, center[0], center[1] - 1, 3, 3, HAIR)
    fill_rect(canvas, center[0] - 3, center[1] - 1, 2, 4, HAIR_LIGHT)
    fill_rect(canvas, center[0] + 1, center[1] - 1, 2, 2, HAIR_LIGHT)
    put(canvas, center[0] + 1, center[1], SKIN_SHADE)
    put(canvas, center[0] - 1, center[1], OUTLINE)
    put(canvas, center[0] + 1, center[1], OUTLINE)
    put(canvas, center[0] + 2, center[1] + 1, SKIN_SHADE)


def draw_torso(canvas, pose, torso_center, hip_center):
    coat_color = COAT_LIGHT if pose["hurt_flash"] else COAT
    torso_x = torso_center[0] - 3
    torso_y = torso_center[1] - 2
    fill_rect(canvas, torso_x, torso_y, 7, 6, coat_color)
    fill_rect(canvas, torso_x + 1, torso_y + 1, 5, 2, COAT_LIGHT)
    fill_rect(canvas, torso_x + 2, torso_y + 4, 3, 1, BRASS)
    flare = pose["coat_flare"]
    fill_rect(canvas, hip_center[0] - 2 - flare, hip_center[1], 2, 4, coat_color)
    fill_rect(canvas, hip_center[0] + flare, hip_center[1], 2, 4, coat_color)
    fill_rect(canvas, torso_x + 5, torso_y + 2, 2, 4, SATCHEL)
    put(canvas, torso_x + 3, torso_y + 5, BRASS)
    put(canvas, torso_x + 2, torso_y + 1, BRASS)
    put(canvas, torso_x + 4, torso_y + 1, BRASS)
    if pose["shard"]:
        fill_rect(canvas, torso_x + 5, torso_y + 1, 1, 2, SHARD)
        put(canvas, torso_x + 4, torso_y + 2, SHARD_LIGHT)


def draw_scarf(canvas, pose, torso_center):
    knot = (torso_center[0] - 1, torso_center[1] - 1)
    fill_rect(canvas, knot[0] - 1, knot[1], 4, 2, SCARF)
    put(canvas, knot[0] + 1, knot[1], SCARF_LIGHT)
    tail_points = [(knot[0] - 1, knot[1] + 1)]
    tail_points.extend(offset_points(pose["scarf"], tail_points[0]))
    thick_polyline(canvas, tail_points, SCARF, 1)
    if len(tail_points) >= 2:
        put(canvas, tail_points[-1][0], tail_points[-1][1], SCARF_LIGHT)


def draw_limbs(canvas, pose, torso_center, hip_center):
    back_shoulder = (torso_center[0] - 2, torso_center[1] - 1)
    front_shoulder = (torso_center[0] + 2, torso_center[1] - 1)
    back_hip = (hip_center[0] - 1, hip_center[1] + 1)
    front_hip = (hip_center[0] + 1, hip_center[1] + 1)

    back_arm_points = [back_shoulder] + offset_points(pose["back_arm"], back_shoulder)
    front_arm_points = [front_shoulder] + offset_points(pose["front_arm"], front_shoulder)
    back_leg_points = [back_hip] + offset_points(pose["back_leg"], back_hip)
    front_leg_points = [front_hip] + offset_points(pose["front_leg"], front_hip)

    thick_polyline(canvas, back_arm_points, COAT, 1)
    thick_polyline(canvas, back_leg_points, PANTS, 1)
    thick_polyline(canvas, front_leg_points, PANTS_LIGHT, 1)
    thick_polyline(canvas, front_arm_points, COAT_LIGHT, 1)

    for hand in (back_arm_points[-1], front_arm_points[-1]):
        fill_rect(canvas, hand[0], hand[1], 2, 2, SKIN)

    for foot in (back_leg_points[-1], front_leg_points[-1]):
        fill_rect(canvas, foot[0] - 1, foot[1], 3, 2, BOOTS)

    return {
        "back_hand": back_arm_points[-1],
        "front_hand": front_arm_points[-1],
    }


def draw_weapon(canvas, weapon, hands):
    if not weapon:
        return

    hand = hands["front_hand"]
    if weapon["type"] == "harpoon":
        tip = offset_point(weapon["tip"], hand)
        butt = offset_point(weapon.get("butt", (-2, 1)), hand)
        thick_line(canvas, butt, tip, METAL_SHADOW, 1)
        thick_line(canvas, hand, tip, METAL, 1)
        fill_rect(canvas, tip[0] - 1, tip[1] - 1, 2, 2, SHARD_LIGHT)
        put(canvas, tip[0] + 1, tip[1], SHARD)
        trail = weapon.get("trail")
        if trail:
            arc = [offset_point(point, hand) for point in trail]
            thick_polyline(canvas, arc, SHARD, 1)
    elif weapon["type"] == "impact":
        point = offset_point(weapon["point"], hand)
        fill_rect(canvas, point[0], point[1], 2, 2, SCARF_LIGHT)
        for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            put(canvas, point[0] + dx, point[1] + dy, BRASS)


def draw_fallen_body(canvas, pose):
    root_x, root_y = pose["root"]
    base_x = 7 + root_x
    base_y = 13 + root_y
    fill_rect(canvas, base_x + 4, base_y - 4, 6, 5, HAIR)
    fill_rect(canvas, base_x + 5, base_y - 3, 5, 4, SKIN)
    fill_rect(canvas, base_x + 1, base_y, 11, 4, COAT)
    fill_rect(canvas, base_x + 8, base_y, 3, 4, SATCHEL)
    fill_rect(canvas, base_x - 1, base_y + 1, 3, 2, COAT_LIGHT)
    fill_rect(canvas, base_x + 11, base_y + 1, 4, 2, COAT_LIGHT)
    fill_rect(canvas, base_x + 3, base_y + 4, 4, 2, PANTS)
    fill_rect(canvas, base_x + 8, base_y + 4, 4, 2, PANTS_LIGHT)
    fill_rect(canvas, base_x + 2, base_y + 5, 4, 2, BOOTS)
    fill_rect(canvas, base_x + 9, base_y + 5, 4, 2, BOOTS)
    fill_rect(canvas, base_x + 2, base_y - 1, 4, 2, SCARF)
    fill_rect(canvas, base_x, base_y - 1, 3, 1, SCARF_LIGHT)
    fill_rect(canvas, base_x + 10, base_y - 2, 2, 2, SHARD)


def render_pose(pose):
    canvas = blank_canvas()
    if pose["fallen"]:
        draw_fallen_body(canvas, pose)
        return add_outline(canvas)

    torso_center, hip_center = torso_geometry(pose)
    hands = draw_limbs(canvas, pose, torso_center, hip_center)
    draw_torso(canvas, pose, torso_center, hip_center)
    draw_head(canvas, pose, torso_center)
    draw_scarf(canvas, pose, torso_center)
    draw_weapon(canvas, pose["weapon"], hands)
    return add_outline(canvas)


def mirror_pose(pose):
    mirrored = deepcopy(pose)
    mirrored["head"] = (-pose["head"][0], pose["head"][1])
    mirrored["back_arm"] = mirrored_points(pose["front_arm"])
    mirrored["front_arm"] = mirrored_points(pose["back_arm"])
    mirrored["back_leg"] = mirrored_points(pose["front_leg"])
    mirrored["front_leg"] = mirrored_points(pose["back_leg"])
    mirrored["scarf"] = mirrored_points(pose["scarf"])
    mirrored["lean"] = -pose["lean"]
    if pose["weapon"] and "tip" in pose["weapon"]:
        mirrored["weapon"] = deepcopy(pose["weapon"])
        mirrored["weapon"]["tip"] = (-pose["weapon"]["tip"][0], pose["weapon"]["tip"][1])
        if "butt" in pose["weapon"]:
            mirrored["weapon"]["butt"] = (-pose["weapon"]["butt"][0], pose["weapon"]["butt"][1])
        if pose["weapon"].get("trail"):
            mirrored["weapon"]["trail"] = mirrored_points(pose["weapon"]["trail"])
    return mirrored


IDLE = [
    merge_pose(root=(0, 0), head=(0, 0), scarf=[(-2, 1), (-4, 2)], coat_flare=0),
    merge_pose(root=(0, 1), head=(0, 1), scarf=[(-1, 1), (-3, 1)], coat_flare=0),
    merge_pose(root=(0, 0), head=(0, -1), scarf=[(-3, 1), (-5, 2)], coat_flare=1),
    merge_pose(root=(0, 1), head=(0, 0), scarf=[(-1, 1), (-2, 3)], coat_flare=0),
]

WALK_BASE = [
    merge_pose(
        root=(0, 0),
        back_arm=[(0, 1), (1, 5)],
        front_arm=[(1, 1), (3, 5)],
        back_leg=[(-2, 3), (-3, 8)],
        front_leg=[(2, 3), (3, 7)],
        scarf=[(-2, 1), (-4, 1)],
        coat_flare=1,
    ),
    merge_pose(
        root=(0, 1),
        back_arm=[(-1, 1), (-1, 5)],
        front_arm=[(1, 1), (2, 6)],
        back_leg=[(-1, 3), (-1, 8)],
        front_leg=[(1, 3), (2, 8)],
        scarf=[(-1, 1), (-2, 2)],
        coat_flare=0,
    ),
    merge_pose(
        root=(0, 0),
        back_arm=[(-2, 1), (-3, 5)],
        front_arm=[(0, 1), (0, 5)],
        back_leg=[(1, 3), (1, 7)],
        front_leg=[(-1, 3), (-3, 8)],
        scarf=[(-3, 1), (-5, 2)],
        coat_flare=1,
    ),
]
WALK = WALK_BASE + [mirror_pose(frame) for frame in WALK_BASE]

RUN_BASE = [
    merge_pose(
        root=(0, 0),
        head=(1, 0),
        lean=1,
        back_arm=[(0, 1), (2, 3)],
        front_arm=[(2, -1), (5, -2)],
        back_leg=[(-3, 2), (-4, 7)],
        front_leg=[(3, 2), (4, 8)],
        scarf=[(-3, 1), (-6, 1), (-8, 0)],
        coat_flare=1,
    ),
    merge_pose(
        root=(0, 1),
        head=(1, 0),
        lean=1,
        back_arm=[(-1, 2), (-2, 6)],
        front_arm=[(1, 0), (4, 2)],
        back_leg=[(-1, 3), (-2, 8)],
        front_leg=[(2, 2), (4, 6)],
        scarf=[(-3, 1), (-6, 2), (-8, 2)],
        coat_flare=0,
    ),
    merge_pose(
        root=(0, 0),
        head=(1, -1),
        lean=1,
        back_arm=[(-2, 2), (-4, 6)],
        front_arm=[(0, 1), (1, 6)],
        back_leg=[(0, 2), (1, 6)],
        front_leg=[(-3, 3), (-4, 8)],
        scarf=[(-4, 1), (-7, 0), (-9, -1)],
        coat_flare=1,
    ),
]
RUN = RUN_BASE + [mirror_pose(frame) for frame in RUN_BASE]

JUMP = [
    merge_pose(
        root=(0, 2),
        head=(0, 1),
        back_arm=[(-1, 2), (-2, 6)],
        front_arm=[(1, 2), (2, 6)],
        back_leg=[(-1, 2), (-2, 5)],
        front_leg=[(1, 2), (2, 5)],
        scarf=[(-1, 1), (-3, 2)],
    ),
    merge_pose(
        root=(0, 0),
        head=(0, 0),
        back_arm=[(-1, 0), (-2, 3)],
        front_arm=[(1, 0), (3, 3)],
        back_leg=[(-2, 2), (-3, 6)],
        front_leg=[(2, 2), (3, 6)],
        scarf=[(-3, 1), (-5, 1)],
        coat_flare=1,
    ),
    merge_pose(
        root=(0, -2),
        head=(0, -1),
        back_arm=[(-1, -1), (-3, -2)],
        front_arm=[(1, -1), (3, -2)],
        back_leg=[(-1, 2), (-2, 5)],
        front_leg=[(1, 2), (2, 5)],
        scarf=[(-4, 1), (-7, 0), (-9, -1)],
        coat_flare=1,
    ),
    merge_pose(
        root=(0, -1),
        head=(0, 0),
        back_arm=[(-2, 0), (-3, 4)],
        front_arm=[(2, 0), (3, 4)],
        back_leg=[(-2, 2), (-4, 6)],
        front_leg=[(2, 2), (4, 6)],
        scarf=[(-4, 1), (-6, 2), (-8, 3)],
        coat_flare=1,
    ),
]

FALL = [
    merge_pose(
        root=(0, -1),
        head=(0, 0),
        back_arm=[(-2, 0), (-4, 2)],
        front_arm=[(2, 0), (4, 2)],
        back_leg=[(-1, 2), (-3, 7)],
        front_leg=[(1, 2), (3, 7)],
        scarf=[(-4, 1), (-6, 3), (-7, 5)],
        coat_flare=1,
    ),
    merge_pose(
        root=(0, 0),
        head=(0, 1),
        back_arm=[(-2, 1), (-3, 5)],
        front_arm=[(2, 1), (4, 5)],
        back_leg=[(-2, 2), (-2, 7)],
        front_leg=[(2, 2), (2, 7)],
        scarf=[(-2, 2), (-3, 5), (-2, 7)],
    ),
    merge_pose(
        root=(0, 1),
        head=(0, 1),
        back_arm=[(-1, 2), (-2, 6)],
        front_arm=[(1, 2), (2, 6)],
        back_leg=[(-2, 2), (-4, 7)],
        front_leg=[(2, 2), (4, 7)],
        scarf=[(-1, 2), (0, 5), (1, 7)],
    ),
    merge_pose(
        root=(0, 1),
        head=(0, 0),
        back_arm=[(-1, 2), (-1, 6)],
        front_arm=[(1, 2), (1, 6)],
        back_leg=[(-1, 2), (-2, 7)],
        front_leg=[(1, 2), (2, 7)],
        scarf=[(-2, 2), (-3, 5), (-4, 7)],
    ),
]

ATTACK = [
    merge_pose(
        root=(0, 0),
        head=(0, 0),
        lean=-1,
        back_arm=[(-2, 1), (-4, 2)],
        front_arm=[(0, 0), (-1, -2)],
        back_leg=[(-1, 3), (-2, 8)],
        front_leg=[(1, 3), (2, 8)],
        scarf=[(-2, 1), (-4, 2)],
        weapon={"type": "harpoon", "tip": (-1, -6), "butt": (1, 3)},
    ),
    merge_pose(
        root=(0, 0),
        head=(1, 0),
        lean=0,
        back_arm=[(-1, 1), (-2, 4)],
        front_arm=[(2, -1), (5, -2)],
        back_leg=[(-1, 3), (-2, 8)],
        front_leg=[(1, 3), (2, 7)],
        scarf=[(-3, 1), (-5, 1)],
        coat_flare=1,
        weapon={"type": "harpoon", "tip": (8, -2), "butt": (-1, 1)},
    ),
    merge_pose(
        root=(1, 0),
        head=(1, -1),
        lean=1,
        back_arm=[(0, 1), (2, 2)],
        front_arm=[(3, 0), (7, 0)],
        back_leg=[(-2, 3), (-3, 8)],
        front_leg=[(2, 2), (4, 7)],
        scarf=[(-4, 1), (-6, 0), (-8, -1)],
        coat_flare=1,
        weapon={
            "type": "harpoon",
            "tip": (10, 0),
            "butt": (-1, 1),
            "trail": [(2, -2), (6, -3), (9, -1)],
        },
    ),
    merge_pose(
        root=(1, 0),
        head=(1, -1),
        lean=1,
        back_arm=[(0, 1), (2, 2)],
        front_arm=[(2, 0), (6, 1)],
        back_leg=[(-1, 3), (-2, 8)],
        front_leg=[(2, 2), (3, 7)],
        scarf=[(-4, 1), (-7, 1), (-9, 0)],
        coat_flare=1,
        weapon={
            "type": "harpoon",
            "tip": (8, 2),
            "butt": (-1, 1),
            "trail": [(1, -1), (5, -1), (7, 1)],
        },
    ),
    merge_pose(
        root=(0, 0),
        head=(0, 0),
        lean=0,
        back_arm=[(-1, 1), (-2, 5)],
        front_arm=[(1, 0), (3, 2)],
        back_leg=[(-1, 3), (-2, 8)],
        front_leg=[(1, 3), (2, 8)],
        scarf=[(-3, 1), (-5, 2)],
        weapon={"type": "harpoon", "tip": (5, 3), "butt": (-1, 1)},
    ),
    merge_pose(),
]

HURT = [
    merge_pose(
        root=(0, 0),
        head=(-1, 0),
        lean=-1,
        back_arm=[(-2, 0), (-4, 1)],
        front_arm=[(0, 1), (1, 5)],
        back_leg=[(-1, 3), (-2, 8)],
        front_leg=[(2, 2), (3, 8)],
        scarf=[(-1, 1), (-3, 0)],
        hurt_flash=True,
        weapon={"type": "impact", "point": (4, -1)},
    ),
    merge_pose(
        root=(0, 1),
        head=(-1, 1),
        lean=-1,
        back_arm=[(-2, 1), (-4, 4)],
        front_arm=[(1, 1), (2, 6)],
        back_leg=[(-1, 3), (-1, 8)],
        front_leg=[(1, 3), (3, 8)],
        scarf=[(-2, 2), (-4, 3)],
        hurt_flash=True,
    ),
    merge_pose(
        root=(0, 1),
        head=(0, 1),
        back_arm=[(-1, 1), (-2, 6)],
        front_arm=[(1, 1), (2, 6)],
        back_leg=[(-1, 3), (-2, 8)],
        front_leg=[(1, 3), (2, 8)],
        scarf=[(-1, 2), (-2, 4)],
    ),
]

DEATH = [
    merge_pose(
        root=(0, 0),
        head=(-1, 0),
        lean=-1,
        back_arm=[(-2, 0), (-4, 2)],
        front_arm=[(0, 1), (1, 6)],
        back_leg=[(-1, 3), (-2, 8)],
        front_leg=[(1, 3), (3, 8)],
        scarf=[(-1, 1), (-3, 0)],
    ),
    merge_pose(
        root=(0, 2),
        head=(-1, 1),
        lean=-1,
        back_arm=[(-2, 1), (-4, 5)],
        front_arm=[(1, 2), (2, 7)],
        back_leg=[(-1, 2), (-2, 6)],
        front_leg=[(1, 2), (2, 6)],
        scarf=[(-1, 2), (-2, 4)],
        coat_flare=1,
    ),
    merge_pose(
        root=(-1, 4),
        head=(-2, 2),
        lean=-2,
        back_arm=[(-3, 1), (-5, 4)],
        front_arm=[(0, 2), (1, 5)],
        back_leg=[(-1, 1), (-3, 5)],
        front_leg=[(1, 1), (2, 5)],
        scarf=[(-2, 1), (-4, 3)],
        coat_flare=1,
    ),
    merge_pose(root=(-1, 2), fallen=True),
    merge_pose(root=(0, 3), fallen=True),
    merge_pose(root=(1, 3), fallen=True),
]

MOTIONS = {
    "idle": IDLE,
    "walk": WALK,
    "run": RUN,
    "jump": JUMP,
    "fall": FALL,
    "attack": ATTACK,
    "hurt": HURT,
    "death": DEATH,
}


def save_motion_frames():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    preview_frames = []

    for motion, frames in MOTIONS.items():
        for index, pose in enumerate(frames):
            rendered = render_pose(pose)
            scaled = upscale(rendered)
            filename = OUTPUT_DIR / f"{motion}_{index:02d}.png"
            save_png(scaled, filename)
            preview_frames.append((motion, scaled))

    return preview_frames


def build_preview_sheet(preview_frames):
    cell_size = LOGICAL_SIZE * SCALE + 8
    motions = list(MOTIONS.keys())
    columns = max(len(frames) for frames in MOTIONS.values())
    rows = len(motions)
    width = columns * cell_size + 8
    height = rows * cell_size + 8
    canvas = blank_canvas(width, height)

    for y in range(height):
        for x in range(width):
            canvas[y][x] = (8, 12, 18, 255)

    for row_index, motion in enumerate(motions):
        frames = [frame for frame_motion, frame in preview_frames if frame_motion == motion]
        for col_index, frame in enumerate(frames):
            offset_x = 8 + col_index * cell_size + 4
            offset_y = 8 + row_index * cell_size + 4
            for y, row in enumerate(frame):
                for x, color in enumerate(row):
                    if color[3] == 0:
                        continue
                    canvas[offset_y + y][offset_x + x] = color

    save_png(canvas, OUTPUT_DIR / "player-motion-preview.png")


def main():
    preview_frames = save_motion_frames()
    build_preview_sheet(preview_frames)
    print(f"Generated {sum(len(frames) for frames in MOTIONS.values())} frames in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
