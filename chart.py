import sys
import json
from pprint import pprint
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
jsonFileName = sys.argv[1];
data = json.load(open(jsonFileName))
smells = [o['smellsCount'] for o in data if o['smells']]
#dates = [o['commiter']['date'] for o in data]
f = plt.figure()
#plt.plot(dates, smells)
plt.plot(smells)
plt.ylabel('Smells over time')
pp = PdfPages(jsonFileName+'result.pdf')
pp.savefig(f)
pp.close()
