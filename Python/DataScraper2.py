import numpy as np
import pandas as pd

from urllib.request import urlopen
from bs4 import BeautifulSoup

import seaborn as sns
import matplotlib.pyplot as plt
from datetime import datetime as Timestamp
import os 



RCPlink = 'https://www.realclearpolitics.com/epolls/2020/president/ca/california_democratic_primary-6879.html'
Bloomlink = 'https://www.bloomberg.com/graphics/2020-presidential-delegates-tracker/data/formatted/by_candidate.json'
local_dir = os.path.normpath(os.path.dirname(os.path.realpath(__file__))+ os.sep + os.pardir)
print(local_dir)

def getHTMLContent(link):
    html = urlopen(link)
    soup = BeautifulSoup(html, 'html.parser')
    return soup

RCPcontent = getHTMLContent(RCPlink)

tables = RCPcontent.find_all('table',{'class':'data large'})

for table in tables:
    rows = table.find_all('tr')
    columns = rows[0].find_all('th')
    column_heads = []
    for columnHead in columns:
        column_heads.append(columnHead.string)
    data = []
    for i, row in enumerate(rows[1:]):
        cells = row.find_all('td')
        poll = cells[0].contents[0]
        row_data = [poll.string]
        for cell in cells[1:]:
            row_data.append(cell.string)
        data.append(row_data)
    df = pd.DataFrame(data, columns = column_heads)

df.set_index('Poll')

df = df.replace(df['Sample'][0], np.NaN)
print(df.head())
df['Start Date'] = df['Date'].apply(lambda x: str(x).split(' - ')[0]+"/2020")
df['End Date'] = df['Date'].apply(lambda x: str(x).split(' - ')[-1]+"/2020")
del df['Date']
df['Population'] = df['Sample'].apply(lambda x: str(x).split(' ')[-1])
df['Sample Size'] = df['Sample'].apply(lambda x: str(x).split(' ')[0])
del df['Sample']
df['Spread Val'] = df['Spread'].apply(lambda x: str(x).split(' +')[-1])
df['Lead'] = df['Spread'].apply(lambda x: str(x).split(' +')[0])
del df['Spread']
df['End Date'] = pd.to_datetime(df['End Date'], format = "%m/%d/%Y",errors='coerce')
df['Start Date'] = pd.to_datetime(df['Start Date'], format = "%m/%d/%Y", errors='coerce')
df.loc[df['End Date'].dt.month>3,'End Date'] = df.loc[df['End Date'].dt.month>3]['End Date'].apply(lambda x: x.replace(year=2019))
df.loc[df['Start Date'].dt.month>3,'Start Date'] = df.loc[df['Start Date'].dt.month>3]['Start Date'].apply(lambda x: x.replace(year=2019))
df['Mid Date'] = (df['End Date']-df['Start Date'])/2+df['Start Date']
print(df.head())

cols = df.columns
for col in cols:
    try:
        df[col] = df[col].astype('float64')
    except:
        pass

df.to_csv(os.path.join(local_dir,"CSV","pollData.csv"))


import json
import codecs

bloomDir = os.path.join(local_dir,"CSV","TempBloom.json")


with codecs.open(bloomDir,'r', 'utf-8-sig') as f:
    print(f)
    data = json.load(f)

BloomData = pd.DataFrame(data)
print(BloomData.head())

congerList = []
for i,row in enumerate(BloomData):
    congerData = pd.DataFrame(BloomData['values'][i])
    congerData['Candidate'] = BloomData['key'][i]
    congerData['dropped_out'] = BloomData['dropped_out'][i]
    congerData['drop_date'] = BloomData['drop_date'][i]
    congerData['delegates_total'] = BloomData['delegates_total'][i]
    congerList.append(congerData)
    
BloomData = pd.concat(congerList)
BloomData.set_index('Candidate')
print(BloomData.head())

BloomData.to_csv(os.path.join(local_dir,"CSV","bloomPollData.csv"))
