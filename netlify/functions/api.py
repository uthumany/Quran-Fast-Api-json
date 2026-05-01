import os
import sys

# Add the server directory to the path so we can import the app
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../server"))

from quran_api import app
from mangum import Mangum

handler = Mangum(app)
