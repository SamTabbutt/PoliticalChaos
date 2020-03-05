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