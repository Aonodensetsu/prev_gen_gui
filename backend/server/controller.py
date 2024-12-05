from json import dumps
from io import BytesIO

from PIL.PngImagePlugin import PngInfo
from prev_gen import Config, Previewer
from flask import send_file


def POST_save(body=None) -> str:
    """
    Generate a PNG from GUI

    :param body:
    :type body: dict

    :rtype: BytesIO
    png image
    """
    body['palette'] = list(map(lambda r: list(map(lambda c: c if c['color'] else {**c, 'color': '000', 'alpha': 0.}, r)), body['palette']))
    try:
        palette = Config.read(dumps(body), output='json').palette
    except ValueError as e:
        return 'Could not parse configuration', 400
    img = Previewer(palette, show=False)
    meta = PngInfo()
    for k, v in img.text.items():
        meta.add_text(k, v)
    buf = BytesIO()
    img.save(buf, format='PNG', pnginfo=meta)
    buf.seek(0)
    return buf, 200, {'Content-Type': 'image/png'}

