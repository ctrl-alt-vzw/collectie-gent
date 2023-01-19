print("main working!")

#imports for sent2vec
from scipy import spatial
from sent2vec.vectorizer import Vectorizer

# import urllib library for API Calls
from urllib.request import urlopen
import json

def getCollectionItems():
    response = urlopen('https://api.collage.gent/annotation')
    return json.loads(response.read())

def filterCollectionItems(json_array):
    collection_items = []
    for item in json_array:
        # now song is a dictionary
        if(item['annotation']):
            collection_items.append(item)
    return collection_items

def getSentencesFromArray(array):
    sentences = []
    for item in array:
        sentences.append(item['annotation'])
    return sentences

def vectorizeSentences(sentences):
    vectorizer = Vectorizer()
    vectorizer.run(sentences)
    vectors_bert = vectorizer.vectors

    dist_1 = spatial.distance.cosine(vectors_bert[0], vectors_bert[1])
    dist_2 = spatial.distance.cosine(vectors_bert[0], vectors_bert[2])
    print('dist_1: {0}, dist_2: {1}'.format(dist_1, dist_2))
    # dist_1: 0.043, dist_2: 0.192
    return vectors_bert

#first get the descriptions
data_json = getCollectionItems()
#print(data_json)

#second filter out items without annotation
collection_items = filterCollectionItems(data_json)

#third create sentence array
sentences = getSentencesFromArray(collection_items)

#third vectorize
#sentences = [
#    "This is an awesome book to learn NLP.",
#    "DistilBERT is an amazing NLP model.",
#    "We can interchangeably use embedding, encoding, or vectorizing.",
#]

#vectors = vectorizeSentences(sentences)

#for index, item in enumerate(collection_items):
#    print(index, item)
#    item['vectors'] = vectors[index]

#with open('vectors.json', 'w') as f:
#    json.dump(collection_items, f)
