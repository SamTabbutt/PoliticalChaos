import numpy as np
from matplotlib import pyplot as plt
from mpl_toolkits.mplot3d import Axes3D


def generateAizAttr(Xi,dt,tfin):
    t = 0
    tn = 0
    a = .95
    b = .7
    c = .6
    d = 3.5
    e=.25
    f=.1
    aizAtt = np.zeros(shape=(int(tfin/dt)+1,3))
    while t<tfin:
        aizAtt[tn] = Xi
        (x,y,z) = Xi
        dx = (z-b) * x - d*y
        dy = d * x + (z-b) * y
        dz = c + (a*z) - (z**3/3) - (x**2+y**2)*(1+e*z) + (f*z*x**3)
        Xi = np.array([x+dx*dt,y+dy*dt,z+dz*dt])
        t = t+dt
        tn+=1
    return aizAtt

def generateArnAttr(Xi,dt,tfin):
    t = 0
    tn = 0
    a = 5
    b = 3.8
    arnAtt = np.zeros(shape=(int(tfin/dt)+1,3))
    while t<tfin:
        arnAtt[tn] = Xi
        (x,y,z) = Xi
        dx = y
        dy = z
        dz = a*x - b*y - z - x**3
        Xi = np.array([x+dx*dt,y+dy*dt,z+dz*dt])
        t = t+dt
        tn+=1
    return arnAtt

mat = generateAizAttr(np.array([.1,0,0]),.005,500)
swap = np.swapaxes(mat,0,1)

fig = plt.figure()
ax = fig.add_subplot(111,projection='3d')

ax.scatter(swap[0],swap[1],swap[2],s=.05)

plt.show()