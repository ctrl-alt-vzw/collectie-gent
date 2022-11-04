from scipy import spatial
from sent2vec.vectorizer import Vectorizer
from urllib.request import urlopen
import json

print("running test!")


sentences = [
    "This is an awesome book to learn NLP.",
    "DistilBERT is an amazing NLP model.",
    "We can interchangeably use embedding, encoding, or vectorizing.",
]

#using the istilbert-base-uncased model
vectorizer = Vectorizer()
vectorizer.run(sentences)
vectors_bert = vectorizer.vectors

print(vectors_bert)
print(type(vectors_bert))
print(type(vectors_bert[0]))
dist_1 = spatial.distance.cosine(vectors_bert[0], vectors_bert[1])
dist_2 = spatial.distance.cosine(vectors_bert[0], vectors_bert[2])
print('dist_1: {0}, dist_2: {1}'.format(dist_1, dist_2))

data = []
for index, vector in enumerate(vectors_bert):
    data.append({
        "sentence": sentences[0],
        "vectors": vector.tolist()
    })

print(data)

with open('vectors1.json', 'w') as f:
    json.dump(data, f)

        
# dist_1: 0.043, dist_2: 0.192