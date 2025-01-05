import requests
from bs4 import BeautifulSoup
import json
import os

def downloadFile(url, destdir):
    if not os.path.exists(destdir):
        os.makedirs(destdir)
        
    print("downloading asset: " + url)

    imageSrc = os.path.join(destdir, (url.split('/')[-1]).split('?')[0])
    print(imageSrc)
    localFilename = imageSrc
    if localFilename is None:
        print("invalid asset name")
        return ""
    
    r = requests.get(url, stream=True)
    with open(localFilename, 'wb') as f:
        for chunk in r.iter_content(chunk_size=1024):
            if chunk: # filter out keep-alive new chunks
                f.write(chunk)
    return localFilename

def parse():
    URLs = ["https://www.elwis.de/DE/Sportschifffahrt/Sportbootfuehrerscheine/Fragenkatalog-See/Basisfragen/Basisfragen-node.html", "https://www.elwis.de/DE/Sportschifffahrt/Sportbootfuehrerscheine/Fragenkatalog-See/Spezifische-Fragen-See/Spezifische-Fragen-See-node.html"]
    questions = []
    for URL in URLs:
        r = requests.get(URL)

        soup = BeautifulSoup(r.content, 'html5lib')

        table = soup.find('div', attrs = {'id':'content'})
        for row in table.find_all('ol'):
            curr = {}
            rootParagraph = row.find_previous_sibling("p", attrs = {"class": "line"}) 
            q = rootParagraph.find_next_sibling("p")
            nextP = q.find_next_sibling("p")
            img = None
            imageSrc = None
            if nextP:
                img = nextP.find("img")
                if img:
                    imageSrc = downloadFile(img['src'], 'assets')
            curr['question'] = q.get_text().strip('\n\r').split('.')[1][1:]
            curr['image'] = imageSrc
            
            answers = []
            isCorrect = True
            for a in row.select("ol li"):
                    answers.append({
                                'text': a.get_text().strip('\n\r'),
                                'correct': isCorrect
                            })
                    isCorrect = False

            curr['answers'] = answers
            questions.append(curr)
    json.dump(questions, open('data.json', 'w'))

parse()