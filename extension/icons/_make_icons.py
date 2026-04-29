"""Generate PromptGuard PNG icons (16/32/48/128) using only stdlib.

Draws a rounded purple square with a white shield-and-lock motif.
"""
import zlib
import struct
import math
import os

# Brand palette
BG = (124, 58, 237, 255)        # purple-600
BG_DARK = (88, 28, 198, 255)    # darker purple for shadow
FG = (255, 255, 255, 255)
ACCENT = (245, 208, 254, 255)


def write_png(path, w, h, pixels):
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    sig = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)

    raw = bytearray()
    for y in range(h):
        raw.append(0)  # filter byte (None)
        for x in range(w):
            i = (y * w + x) * 4
            raw.append(pixels[i])
            raw.append(pixels[i + 1])
            raw.append(pixels[i + 2])
            raw.append(pixels[i + 3])

    idat = zlib.compress(bytes(raw), 9)
    with open(path, 'wb') as f:
        f.write(sig)
        f.write(chunk(b'IHDR', ihdr))
        f.write(chunk(b'IDAT', idat))
        f.write(chunk(b'IEND', b''))


def blend(bg, fg):
    a = fg[3] / 255.0
    return (
        int(bg[0] * (1 - a) + fg[0] * a),
        int(bg[1] * (1 - a) + fg[1] * a),
        int(bg[2] * (1 - a) + fg[2] * a),
        255,
    )


def draw(size: int) -> bytearray:
    px = bytearray(size * size * 4)

    def put(x, y, color):
        if 0 <= x < size and 0 <= y < size:
            i = (y * size + x) * 4
            existing = (px[i], px[i + 1], px[i + 2], px[i + 3])
            if color[3] == 255 and existing[3] == 0:
                px[i:i + 4] = bytes(color)
            else:
                # naive over compositing on transparent base
                base = existing if existing[3] > 0 else (0, 0, 0, 0)
                a = color[3] / 255.0
                inv = 1 - a
                r = int(base[0] * inv + color[0] * a)
                g = int(base[1] * inv + color[1] * a)
                b = int(base[2] * inv + color[2] * a)
                aa = int(min(255, base[3] + color[3]))
                px[i:i + 4] = bytes((r, g, b, aa))

    # rounded square background (radius ≈ size * 0.22)
    radius = max(2, int(size * 0.22))
    for y in range(size):
        for x in range(size):
            cx = x
            cy = y
            inset = 0
            xx = cx - inset
            yy = cy - inset
            inner_w = size - 2 * inset
            inner_h = size - 2 * inset
            # signed distance to rounded rect
            qx = abs(xx - inner_w / 2) - (inner_w / 2 - radius)
            qy = abs(yy - inner_h / 2) - (inner_h / 2 - radius)
            qx = max(qx, 0)
            qy = max(qy, 0)
            dist = math.sqrt(qx * qx + qy * qy) - radius
            if dist <= 0:
                # inside background
                put(x, y, BG)
            elif dist < 1.0:
                # antialias edge
                a = int((1 - dist) * 255)
                put(x, y, (BG[0], BG[1], BG[2], a))

    # Shield shape (centered)
    cx = size / 2
    cy = size * 0.50
    sw = size * 0.46
    sh = size * 0.56

    # Shield: top half is rectangle with rounded top, bottom half tapers to a point.
    # We render by rasterising a parameterised path.
    def in_shield(x, y):
        rx = (x - cx) / (sw / 2)
        ry = (y - cy) / (sh / 2)
        if abs(rx) > 1: return False
        if ry < -1: return False
        if ry < 0:
            return abs(rx) < 1
        # Bottom: x range narrows linearly to 0 at ry = 1
        edge = 1 - ry  # from 1 at ry=0 to 0 at ry=1
        return abs(rx) < edge

    for y in range(size):
        for x in range(size):
            if in_shield(x + 0.5, y + 0.5):
                put(x, y, FG)

    # Lock keyhole inside shield: small circle + trapezoid below
    keyhole_cx = cx
    keyhole_cy = cy - size * 0.04
    keyhole_r = max(1.0, size * 0.07)
    for y in range(size):
        for x in range(size):
            dx = x + 0.5 - keyhole_cx
            dy = y + 0.5 - keyhole_cy
            d = math.sqrt(dx * dx + dy * dy)
            if d < keyhole_r:
                put(x, y, BG)

    # Trapezoid stem under keyhole
    stem_top_y = keyhole_cy + keyhole_r * 0.4
    stem_bot_y = keyhole_cy + size * 0.13
    stem_top_w = size * 0.05
    stem_bot_w = size * 0.10
    for y in range(int(stem_top_y), int(stem_bot_y) + 1):
        if 0 <= y < size:
            t = (y - stem_top_y) / max(1, stem_bot_y - stem_top_y)
            half_w = stem_top_w / 2 + t * (stem_bot_w / 2 - stem_top_w / 2)
            for x in range(int(cx - half_w), int(cx + half_w) + 1):
                put(x, y, BG)

    return px


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    for sz in (16, 32, 48, 128):
        out = os.path.join(here, f'icon-{sz}.png')
        pixels = draw(sz)
        write_png(out, sz, sz, pixels)
        print(f'wrote {out}')


if __name__ == '__main__':
    main()
