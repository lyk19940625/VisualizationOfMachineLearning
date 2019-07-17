# -*- coding: UTF-8 -*-
from math import log
import operator
from matplotlib import pyplot as plt
import pydotplus
from sklearn.externals.six import StringIO
from sklearn import tree
import random
import sys
import os       
os.environ["PATH"] += os.pathsep + 'F:/Graphviz2.38/bin/'
# 计算给定数据集的经验熵

# 创建测试数据集
def createDataSet(data):
    dataset=[]
    for n in range(len(data['结果'])):
        a=[]
        for key in data.keys():
            a.append(data[key][n])
        dataset.append(a)
    labels = list(data.keys())
    #print(dataset[0])
    labels=labels[:-1]
    
    return dataset,labels                                       # 返回数据集和分类属性

def splitDataset(dataset, splitRatio):
	trainSize = int(len(dataset) * splitRatio)
	trainSet = []
	copy = list(dataset)
	while len(trainSet) < trainSize:
		index = random.randrange(len(copy))
		trainSet.append(copy.pop(index))
	return [trainSet, copy]

def plotshow(max_depth,criterion,splitter,min_samples_split,trainingSet,testSet):
    data=[]
    label=[]
    data_test=[]
    label_test=[]
    for i in range(len(trainingSet)):
        data.append(trainingSet[i][:-1])
        label.append(trainingSet[i][-1])
    names =  list(set(label)) 
    names.sort(key=label.index)
    class_names = [str(i) for i in names]
    for n in range(len(testSet)):
        data_test.append(testSet[n][:-1])
        label_test.append(testSet[n][-1])
    global clf
    clf = tree.DecisionTreeClassifier(splitter=splitter,max_depth=max_depth,criterion=criterion,min_samples_split=min_samples_split)
    clf = clf.fit(data, label)
    score = clf.score(data_test,label_test)
    dot_data=tree.export_graphviz(clf,class_names=class_names,out_file = None,filled=True, rounded=True,special_characters=True)
    
    graph = pydotplus.graph_from_dot_data(dot_data) 
    graph.write_png("E:/Anaconda/Scripts/CorsApi/snippets/static/picture/dtree.png") 
    return score

def predict(dtree_predict):
    pred=clf.predict(dtree_predict)
    return pred

    
def dtree(max_depth,criterion,splitter,min_samples_split,data):
    splitRatio = 0.67
    dataSet, labels = createDataSet(data)
    trainingSet, testSet = splitDataset(dataSet, splitRatio)
    
    #print(myTree)
    score = plotshow(max_depth,criterion,splitter,min_samples_split,trainingSet,testSet)
    return score