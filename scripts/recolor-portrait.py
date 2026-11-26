"""Recolor the flat background and halo of a portrait to exact colours, keeping the drawing.

Each region (background, halo) is found as the connected area around a seed point whose colour
is close to the region's colour. Pixels on its antialiased edge are treated as a mix of the old
region colour and the neighbouring drawing colour, and only the region's share is shifted.
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

def hexrgb(h): return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32)

def region(a, seeds, tol):
    ref = np.mean([a[y, x] for x, y in seeds], axis=0)
    close = np.linalg.norm(a - ref, axis=2) < tol
    lab, _ = ndi.label(close)
    ids = {lab[y, x] for x, y in seeds} - {0}
    return np.isin(lab, list(ids)), ref

def recolor(a, mask, old, new, ring=3):
    out = a.copy()
    out[mask] += new - old                                  # keeps any shading or texture
    # Edge pixels: blend of the region colour and the nearest colour outside the edge band.
    band = ndi.binary_dilation(mask, iterations=ring) & ~mask
    outside = ~(mask | band)
    _, (iy, ix) = ndi.distance_transform_edt(~outside, return_indices=True)
    fg = a[iy, ix]
    d_fg_old = np.linalg.norm(fg - old, axis=2)
    d_px_fg = np.linalg.norm(a - fg, axis=2)
    t = np.clip(d_px_fg / np.maximum(d_fg_old, 1e-3), 0, 1)  # share of the old region colour
    out[band] += (t[band][:, None]) * (new - old)
    return out

def main(src, dst, bg_new, halo_new, bg_seeds, halo_seeds):
    a = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
    bg, bg_old = region(a, bg_seeds, 14)
    halo, halo_old = region(a, halo_seeds, 12)
    out = recolor(a, bg, bg_old, hexrgb(bg_new))
    # The halo is recoloured from the original pixels, so its edge is unmixed against the drawing.
    h = recolor(a, halo, halo_old, hexrgb(halo_new))
    edge = ndi.binary_dilation(halo, iterations=3)
    out[edge] = h[edge]
    Image.fromarray(np.clip(out, 0, 255).round().astype(np.uint8)).save(dst)

if __name__ == '__main__':
    # python3 scripts/recolor-portrait.py SRC DST BG_HEX HALO_HEX
    # Seeds: the four corners are background; three points on the ring are halo (1122 x 1402 source).
    src, dst, bg_hex, halo_hex = sys.argv[1:5]
    main(src, dst, bg_hex, halo_hex, [(20, 20), (1100, 20), (20, 1000), (1100, 900)], [(200, 600), (900, 500), (560, 250)])
