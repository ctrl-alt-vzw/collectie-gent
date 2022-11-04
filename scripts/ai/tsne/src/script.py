print("main working!")

from sklearn.manifold import TSNE
from sklearn.datasets import load_iris
import json
#from numpy import reshape
import numpy as np
import seaborn as sns
import pandas as pd  

def readJsonFile(url):
    f = open(url)
    data = json.load(f)
    f.close()
    return data

def writeJsonFile(url, data):
    with open(url, 'w') as f:
        json.dump(data, f)
        print("Done writing file to {0}".format(url))

def getPropertyFromList(list, property):
    returnList = []
    for item in list:
        returnList.append(item[property])
    return returnList


input = readJsonFile('input/vectors_031122.json')
vectors_list = []
for obj in input:
    vectors_list.append(obj['vectors'])
input_vectors = np.array(vectors_list)

#X = np.array([[0, 0, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1]])
vectors_embedded = TSNE(n_components=3, learning_rate='auto',
                  init='pca', perplexity=50, ).fit_transform(input_vectors)
print(vectors_embedded.shape)

#add info to vectors
output = []
sentences = getPropertyFromList(input, 'sentence')
ids = getPropertyFromList(input, 'id')
uuids = getPropertyFromList(input, 'UUID')
uris = getPropertyFromList(input, 'gentImageURI')
for index, vector in enumerate(vectors_embedded):
    output.append({
        "id": ids[index],
        "UUID": uuids[index],
        "gentImageURI": uris[index],
        "sentence": sentences[index],
        "vectors": vector.tolist()
    })

writeJsonFile('output/out_3D_perplex_50.json', output)