import numpy as np
import pandas as pd

from urllib.request import urlopen
from bs4 import BeautifulSoup

import seaborn as sns
import matplotlib.pyplot as plt
from datetime import datetime as Timestamp
import os 



link = 'https://www.realclearpolitics.com/epolls/2020/president/ca/california_democratic_primary-6879.html'
local_dir = os.path.dirname(os.path.realpath(__file__))


def getHTMLContent(link):
    html = urlopen(link)
    soup = BeautifulSoup(html, 'html.parser')
    return soup

content = getHTMLContent(link)

tables = content.find_all('table',{'class':'data large'})

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
print(df.head())


df = df.replace(df['Sample'][0], np.NaN)
df['Start Date'] = df['Date'].apply(lambda x: x.split(' - ')[0]+"/2020")
df['End Date'] = df['Date'].apply(lambda x: x.split(' - ')[1]+"/2020")
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
        print("transformed: ",col)
    except:
        print("Not number: ",col)

df.to_csv(os.path.join(local_dir,"pollData.csv"))

"""
df_list = []
candidates = ['Sanders ','Biden ','Warren ','Bloomberg ','Buttigieg ','Klobuchar ']
for i,cand in enumerate(candidates):
    race_df = pd.DataFrame()
    race_df['Results'] = df[cand]
    race_df['Day'] = df['End Date']
    race_df['label'] = cand
    race_df.sort_values(by=['Day'],ascending=False)
    df_list.append(race_df)

df_stack = pd.concat(df_list)

sns.set()
pl = sns.pointplot(x='Day',y='Results',hue='label',data=df_stack,scale=.5)
pl.set_xticklabels(labels = df_stack['Day'],rotation=45)
plt.show()

lead_df = df['Lead'].value_counts(normalize=False, sort=True, ascending=False, bins=None, dropna=True).plot.bar()
lead_df.set_ylabel('Number of polls won')
plt.show()

corona_dat = pd.read_csv(os.path.join(local_dir,"coronaData.csv"))
corona_dat['coronavirus: (United States)'] = corona_dat['coronavirus: (United States)'].apply(lambda x: float(str(x).split('<')[-1]))
corona_dat['Results']=corona_dat['coronavirus: (United States)']
corona_dat['label'] = 'Corona'
corona_dat['Day'] = pd.to_datetime(corona_dat['Day'], format = "%Y-%m-%d", errors='ignore')
print(corona_dat['Day'])
sns.lineplot(x='Day',y='coronavirus: (United States)',data=corona_dat)
plt.show()

bern = pd.DataFrame()
bern['Day']=df['Mid Date']
bern['Results']=df['Bloomberg ']
bern['label']='Sanders'

bernVsCoron = pd.merge(right=bern,left = corona_dat,how='left',on='Day')
bernVsCoron = bernVsCoron.interpolate(axis=0)
sns.lineplot(x='Day',y='Results',hue='label',data=bernVsCoron)
plt.show()

ax = bernVsCoron.plot(x="Day", y="Results_x", legend=False)
ax2 = ax.twinx()
bernVsCoron.plot(x="Day", y="Results_y", ax=ax2,legend=False, color="r")
ax.figure.legend(['Corona','Bloomberg'])
ax.set(ylabel='Frequency of Coronavirus searches on Google')
ax2.set(ylabel='Bloomberg polularity in polls')
plt.show()"""