import os
import sys
import base64
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')
Image.MAX_IMAGE_PIXELS = None

BASE_DIR = r"D:\T&TVina\VEC_2026_2\mockup"
V3_SOURCE_DIR = os.path.join(BASE_DIR, "textures", "V3")
TEXTURE_DIR = os.path.join(BASE_DIR, "textures")

# 1. Map Figma V3 files to target texture names
v3_mappings = [
    {
        "id": "v3_backwall",
        "src": os.path.join(V3_SOURCE_DIR, "vec2026_backwall_full_3000x2500mm 6.png"),
        "dest": os.path.join(TEXTURE_DIR, "v3_backwall.png"),
        "max_w": 2048
    },
    {
        "id": "v3_sidewall",
        "src": os.path.join(V3_SOURCE_DIR, "vec2026_sidewall_full_3000x2500mm 6.png"),
        "dest": os.path.join(TEXTURE_DIR, "v3_sidewall.png"),
        "max_w": 2048
    },
    {
        "id": "v3_valance_front",
        "src": os.path.join(V3_SOURCE_DIR, "v3_valance_front_side.png"),
        "dest": os.path.join(TEXTURE_DIR, "v3_valance_front.png"),
        "max_w": 2048
    },
    {
        "id": "v3_valance_side",
        "src": os.path.join(V3_SOURCE_DIR, "v3_valance_front_side.png"),
        "dest": os.path.join(TEXTURE_DIR, "v3_valance_side.png"),
        "max_w": 2048
    }
]

print("=== [1/2] OPTIMIZING FIGMA V3 PNG TEXTURES (LANCZOS 2048px) ===")
for item in v3_mappings:
    src_file = item["src"]
    dest_file = item["dest"]
    max_w = item["max_w"]
    
    if not os.path.exists(src_file):
        print(f"Warning: Source file not found: {src_file}")
        continue
        
    orig_size_mb = os.path.getsize(src_file) / (1024 * 1024)
    with Image.open(src_file) as im:
        w, h = im.size
        scale = max_w / float(w)
        new_w = int(w * scale)
        new_h = int(h * scale)
        
        # High quality downsampling
        resized = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
        resized.save(dest_file, format="PNG", optimize=True)
        
    new_size_mb = os.path.getsize(dest_file) / (1024 * 1024)
    print(f"[OK] {os.path.basename(dest_file)}: {w}x{h} ({orig_size_mb:.1f}MB) -> {new_w}x{new_h} ({new_size_mb:.2f}MB)")

print("\n=== [2/2] GENERATING BASE64 DATA SCRIPT (textures_data.js) ===")

all_texture_files = [
    # V3 (New Safe-Zone & Visual First - Figma Refined)
    ("v3_backwall", os.path.join(TEXTURE_DIR, "v3_backwall.png")),
    ("v3_sidewall", os.path.join(TEXTURE_DIR, "v3_sidewall.png")),
    ("v3_valance_front", os.path.join(TEXTURE_DIR, "v3_valance_front.png")),
    ("v3_valance_side", os.path.join(TEXTURE_DIR, "v3_valance_side.png")),
    
    # V2 (Figma Edited)
    ("v2_backwall", os.path.join(TEXTURE_DIR, "v2_backwall.png")),
    ("v2_sidewall", os.path.join(TEXTURE_DIR, "v2_sidewall.png")),
    ("v2_valance_front", os.path.join(TEXTURE_DIR, "v2_valance_front.png")),
    ("v2_valance_side", os.path.join(TEXTURE_DIR, "v2_valance_side.png")),
    
    # V1 (Original Production)
    ("v1_backwall", os.path.join(TEXTURE_DIR, "v1_backwall.png")),
    ("v1_sidewall", os.path.join(TEXTURE_DIR, "v1_sidewall.png")),
    ("v1_valance_front", os.path.join(TEXTURE_DIR, "v1_valance_front.png")),
    ("v1_valance_side", os.path.join(TEXTURE_DIR, "v1_valance_side.png")),
]

js_path = os.path.join(BASE_DIR, "textures_data.js")
with open(js_path, "w", encoding="utf-8") as f:
    f.write("// Auto-generated optimized Base64 texture payload for 100% offline & fast WebGL loading\n")
    f.write("window.TEXTURE_DATA = {\n")
    for key, path in all_texture_files:
        if os.path.exists(path):
            with open(path, "rb") as img_f:
                b64_str = base64.b64encode(img_f.read()).decode("utf-8")
                f.write(f'  "{key}": "data:image/png;base64,{b64_str}",\n')
                print(f"  + Added {key} ({os.path.getsize(path) // 1024} KB)")
    f.write("};\n")

print(f"\n[SUCCESS] Generated textures_data.js: {os.path.getsize(js_path) / (1024 * 1024):.2f} MB")
