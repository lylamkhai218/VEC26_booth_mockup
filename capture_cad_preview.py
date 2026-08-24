import os, subprocess

EDGE_PATH = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
html_path = os.path.abspath('d:/T&TVina/VEC_2026_2/mockup/index.html')
out_desktop = os.path.abspath('d:/T&TVina/VEC_2026_2/mockup/preview_cad_desktop.png')
out_mobile = os.path.abspath('d:/T&TVina/VEC_2026_2/mockup/preview_cad_mobile.png')

url = 'file:///' + html_path.replace('\\', '/')

cmd_desktop = [
    EDGE_PATH,
    '--headless',
    '--disable-gpu',
    '--run-all-compositor-stages-before-draw',
    '--window-size=1440,900',
    f'--screenshot={out_desktop}',
    url
]
subprocess.run(cmd_desktop, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

cmd_mobile = [
    EDGE_PATH,
    '--headless',
    '--disable-gpu',
    '--run-all-compositor-stages-before-draw',
    '--window-size=390,844',
    f'--screenshot={out_mobile}',
    url
]
subprocess.run(cmd_mobile, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

print('[OK] Captured desktop & mobile screenshots')
