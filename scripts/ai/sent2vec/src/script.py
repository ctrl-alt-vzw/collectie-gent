print("main working!")

#imports for sent2vec
from scipy import spatial
from sent2vec.vectorizer import Vectorizer

# import urllib library for API Calls
from urllib.request import urlopen
import json

def getCollectionItems():
    response = urlopen('https://api.datacratie.cc/annotation')
    return json.loads(response.read())

def filterCollectionItems(json_array):
    print("Print from filter function")
    collection_items = []
    for item in json_array:
        if item['annotation']:
            collection_items.append(item)
    return collection_items

def getSentencesFromArray(array):
    sentences = []
    for item in array:
        sentences.append(item['annotation'])
    return sentences

def getPropertyFromList(list, property):
    returnList = []
    for item in list:
        returnList.append(item[property])
    return returnList

def vectorizeSentences(sentences):
    #using the distilbert-base-uncased model
    vectorizer = Vectorizer()
    vectorizer.run(sentences)
    vectors_bert = vectorizer.vectors

    dist_1 = spatial.distance.cosine(vectors_bert[0], vectors_bert[1])
    dist_2 = spatial.distance.cosine(vectors_bert[0], vectors_bert[2])
    print('dist_1: {0}, dist_2: {1}'.format(dist_1, dist_2))
    # dist_1: 0.043, dist_2: 0.192
    return vectors_bert

def chunks(xs, n):
    n = max(1, n)
    return (xs[i:i+n] for i in range(0, len(xs), n))


#first get the descriptions
data_json = getCollectionItems()

#second filter out items without annotation
collection_items = filterCollectionItems(data_json)

#vectorize batch
data = []
batched_items = chunks(collection_items, 100)
batch_num = 0
for list in batched_items:
    #print(list)
    print('Vectorizing bath num {0}'.format(batch_num))
    sentences = getSentencesFromArray(list)
    ids = getPropertyFromList(list, 'id')
    uuids = getPropertyFromList(list, 'UUID')
    uris = getPropertyFromList(list, 'gentImageURI')
    vectors = vectorizeSentences(sentences)
    for index, vector in enumerate(vectors):
        data.append({
            "id": ids[index],
            "UUID": uuids[index],
            "gentImageURI": uris[index],
            "sentence": sentences[index],
            "vectors": vector.tolist()
        })

with open('/output/vectors_051122.json', 'w') as f:
    json.dump(data, f)

exit()