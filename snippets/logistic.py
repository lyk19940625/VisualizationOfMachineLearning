#! /usr/bin/env python
# -*- coding: utf-8 -*-
"""
实现logistic回归分类算法， 数据集为: dataset.csv
"""

import numpy as np
import matplotlib.pyplot as plt

def loadDataSet():
   dataset=[]
    for n in range(len(data['结果'])):
        a=[]
        for key in data.keys():
            a.append(data[key][n])
        dataset.append(a)
    labels = list(data.keys())
    #print(dataset[0])
    labels=labels[:-1]
    
    return dataset,labels   
    
def sigmoid(inX):
    
    return 1.0 / (1 + np.exp(-inX))
        

def randomGradAscent2(dataMat, labelMat):
    """
    改进的随机梯度上升算法
    """
    dataMatrix = np.array(dataMat)
    m, n = np.shape(dataMatrix)
    # 初始化参数
    weights = np.ones(n)
    # 迭代次数
    numIter = 500
    for i in range(numIter):
        # 初始化index列表，这里要注意将range输出转换成list
        dataIndex = list(range(m))
        # 遍历每一行数据，这里要注意将range输出转换成list
        for j in list(range(m)):
            # 更新alpha值，缓解数据高频波动
            alpha = 4/(1.0+i+j)+0.0001
            # 随机生成序列号，从而减少随机性的波动
            randIndex = int(np.random.uniform(0, len(dataIndex)))
            # 序列号对应的元素与权重矩阵相乘，求和后再求sigmoid
            h = sigmoid(sum(dataMatrix[randIndex]*weights))
            # 求误差，和之前一样的操作
            error = labelMat[randIndex] - h
            # 更新权重矩阵
            weights = weights + alpha * error * dataMatrix[randIndex]
            # 删除这次计算的数据
            del(dataIndex[randIndex])
    return weights

def plotBestFit(weights):
    
    dataMat, labelMat = loadDataSet()
    dataArr = np.array(dataMat)
    # 获取数组行数
    n = np.shape(dataArr)[0]
    # 初始化坐标
    xcord1 = []; ycord1 = []
    xcord2 = []; ycord2 = []
    # 遍历每一行数据
    for i in range(n):
        # 如果对应的类别标签对应数值1，就添加到xcord1，ycord1中
        if int(labelMat[i]) == 1:
            xcord1.append(dataArr[i,1]); ycord1.append(dataArr[i,2])
        # 如果对应的类别标签对应数值0，就添加到xcord2，ycord2中
        else:
            xcord2.append(dataArr[i,1]); ycord2.append(dataArr[i,2])
    fig = plt.figure()
    # 添加subplot，三种数据都画在一张图上
    ax = fig.add_subplot(111)
    # 1类用红色标识，marker='s'形状为正方形
    ax.scatter(xcord1, ycord1, s=30, c='red', marker='s')
    # 0类用绿色标识，弄认marker='o'为圆形
    ax.scatter(xcord2, ycord2, s=30, c='green')
    # 设置x取值，arange支持浮点型
    x = np.arange(-3.0, 3.0, 0.1)
    # 配计算y的值
    y = (-weights[0]-weights[1]*x)/weights[2]
    # 画拟合直线
    ax.plot(x, y)
    # 贴坐标表头
    plt.xlabel('X1'); plt.ylabel('X2')
    # 显示结果
    plt.show()


if __name__ == '__main__':
    dataArr, labelMat = loadDataSet()
    weights3 = np.mat(randomGradAscent2(dataArr, labelMat)).transpose()
    print (weights3)
    plotBestFit(weights3.getA())