# api/analyze.py
import json
from http import HTTPStatus
from preprocessor import preprocess
import helper

def handler(request):
    """
    Vercel expects a function called `handler` that takes a request-like object.
    We'll read either `request.files` or JSON/text body.
    """
    try:
        # Read raw chat text
        if request.files and 'file' in request.files:
            data = request.files['file'].read().decode('utf-8')
        else:
            body = request.get_data(as_text=True)
            data = json.loads(body).get('text', '')

        # Preprocess into DataFrame
        df = preprocess(data)

        # Compute overall stats
        stats = helper.fetch_stats('OVERALL', df)
        result = {
            'total_messages': stats[0],
            'total_words':    stats[1],
            'total_media':    stats[2],
            'total_links':    stats[3]
        }

        # (You can extend here: detailed analysis, per-user breakdown, etc.)

        return {
            'statusCode': HTTPStatus.OK,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps(result)
        }

    except Exception as e:
        return {
            'statusCode': HTTPStatus.INTERNAL_SERVER_ERROR,
            'body': json.dumps({'error': str(e)})
        }
