# 结果展示：

![avatar](https://github.com/lyk19940625/VisualizationOfMachineLearning/blob/master/result1.jpg)
![avatar](https://github.com/lyk19940625/VisualizationOfMachineLearning/blob/master/result2.jpg)

# python机器学习之 K-邻近算法

@简单的理解：[ 采用测量不同特征值之间的距离方法进行分类 ]

- **优点** ：精度高、对异常值不敏感、无数据输入假定
 
- **缺点** ：计算复杂度高，空间复杂度高；
- **适应数据范围** ：数值型、标称型；

-------------------
[TOC]
## kNN简介

> **kNN 原理** ：存在一个样本数据集合，也称作训练集或者样本集，并且样本集中每个数据都存在标签，即样本集实际上是 **每条数据** 与 **所属分类** 的 **对应关系**。
 > **核心思想** ：若输入的数据没有标签，则新数据的每个特征与样本集中数据对应的特征进行比较，该算法提取样本集中特征最相似数据（最近邻）的分类标签。
 > **k** ：选自最相似的k个数据，通常是不大于20的整数，最后选择这k个数据中出现次数最多的分类，作为新数据的分类。


### k-近邻算法的一般流程
```sequence

1.收集数据：可以使用任何方法。
2.准备数据：距离计算所需的数值，最好是结构化的数据格式。
3.分析数据：可以使用任何方法。
4.训练算法：此不走不适用于k-近邻算法。
5.测试算法：计算错误率。
6.使用算法：首先需要输入样本数据和结构化的输出结果，然后运行k-近邻算法判定输入数据分别属于哪个分类，最后应用对计算出的分类之行后续的处理。
```
###example1
#### python导入数据
```	python
from numpy import *
import operator

def	createDataSet():
	group = array([[1.0,1.1],[1.0,1.0],[0,0],[0,0.1]])
	labels = ['A','A','B','B']
	return group,labels
```
#### python处理数据
``` python 
#计算已知类别数据集中的点与当前点之间的距离（欧式距离）
#按照距离递增次序排序
#选取与当前点距离最小的K个点
#确定前K个点所在类别的出现频率
#返回前k个点出现频率最高的类别最为当前点的预测分类
#inX输入向量，训练集dataSet,标签向量labels，k表示用于选择最近邻的数目
def	clissfy0(inX,dataSet,labels,k):
	dataSetSize = dataSet.shape[0]
	diffMat = tile(inX,(dataSetSize,1)) - dataSet
	sqDiffMat = diffMat ** 0.5
	sqDistances = sqDiffMat.sum(axis=1)
	distances = sqDistances ** 0.5
	sortedDistIndicies = distances.argsort()
	classCount = {}
	for i in range(k):
		voteLabel = labels[sortedDistIndicies[i]]
		classCount[voteLabel] = classCount.get(voteLabel,0) + 1
	sortedClassCount = sorted(classCount.iteritems(),
		key = operator.itemgetter(1),reverse = True)
	return sortedClassCount[0][0]
```
####python数据测试
```python
import kNN
from numpy import *

dataSet,labels = createDataSet()
testX = array([1.2,1.1])
k = 3
outputLabelX = classify0(testX,dataSet,labels,k)
testY = array([0.1,0.3])
outputLabelY = classify0(testY,dataSet,labels,k)

print('input is :',testX,'output class is :',outputLabelX)
print('input is :',testY,'output class is :',outputLabelY)
```
####python结果输出
```
('input is :', array([ 1.2,  1.1]), 'output class is :', 'A')
('input is :', array([ 0.1,  0.3]), 'output class is :', 'B')
```
###example2使用k-近邻算法改进约会网站的配对效果
#### 处理步骤
```
1.收集数据：提供文本文件
2.准备数据：使用python解析文本文件
3.分析数据:使用matplotlib画二维扩散图
4.训练算法：此步骤不适用与k－近邻算法
5.测试算法：使用提供的部份数据作为测试样本
6:使用算法：输入一些特征数据以判断对方是否为自己喜欢的类型
```
####python 整体实现
```python
#coding:utf-8
from numpy import *
import operator
from kNN import classify0
import matplotlib.pyplot as plt

def file2matrmix(filename):
    fr = open(filename)
    arrayLines = fr.readlines()
    numberOfLines = len(arrayLines)
    returnMat = zeros((numberOfLines,3))
    classLabelVector = []
    index = 0
    for line in arrayLines:
        line = line.strip()
        listFromLine = line.split('\t')
        returnMat[index,:] = listFromLine[0:3]
        classLabelVector.append(int(listFromLine[-1]))
        index +=1

    return returnMat,classLabelVector

def autoNorm(dataSet):
    minVals = dataSet.min(0)
    maxVals = dataSet.max(0)
    ranges = maxVals - minVals
    normDataSet = zeros(shape(dataSet))
    m = dataSet.shape[0]
    normDataSet = dataSet - tile(minVals,(m,1))
    normDataSet = normDataSet/tile(ranges,(m,1))

    return normDataSet,ranges,minVals

def datingClassTest():
    hoRatio = 0.10
    datingDataMat,datingLabels = file2matrmix('datingTestSet2.txt')
    normMat,ranges,minVals = autoNorm(datingDataMat)
    m = normMat.shape[0]
    numTestVecs = int(m * hoRatio)
    errorCount = 0.0
    for i in range(numTestVecs):
        classifierResult = classify0(normMat[i,:],normMat[numTestVecs:m,:],datingLabels[numTestVecs:m],3)
        print('the classifier came back with: %d, the real answer is: %d' %(classifierResult,datingLabels[i]))
        if (classifierResult != datingLabels[i]):
            errorCount += 1.0
    print('the total error rate is: %f' %(errorCount / float(numTestVecs)))

def classifyPerson():
    resultList = ['not at all','in small doses','in large doses']
    percentTats = float(raw_input('percentage of time spent playing video games?'))
    ffMiles = float(raw_input('frequent flier miles earned per year?'))
    iceCream = float(raw_input('liters of ice cream consumed per year?'))
    datingDataMat,datingLabels = file2matrmix('datingTestSet2.txt')
    normMat,ranges,minVals =autoNorm(datingDataMat)
    inArr = array([ffMiles,percentTats,iceCream])
    classifierResult = classify0((inArr - minVals) / ranges,normMat,datingLabels,3)
    print('you will probably like this person:',resultList[classifierResult - 1])

datingDataMat,datingLabels = file2matrmix('datingTestSet2.txt')
classifyPerson()
fig = plt.figure()
ax = fig.add_subplot(111)
ax.scatter(datingDataMat[:,1],datingDataMat[:,2],15.0 * array(datingLabels),15.0 * array(datingLabels))
plt.show()
```
###K-最近邻算法总结
>**k近邻算法**是最简单有效的分类算法，必须全部保存全部数据集，如果训练数据集很大，必须使用大量的存储空间，同时由于必须对数据集中的每个数据计算距离值，实际使用可能非常耗时。
>**k近邻算法**无法给出任何数据的基础结构信息，我们无法知晓平均实例样本和典型实例样本具有神秘特征。

# 决策树
###决策树简介
>**决策树** 流程图正方形代表判断模块，椭圆形代表终止模块，从判断模块引出的左右箭头称作分支，它可以到达另一个判断模块活着终止模块。
>**决策树 [优点]**:计算复杂度不高，输出结果易于理解，对于中间值的缺失不敏感，可以处理不相关特征数据。
>**决策树[缺点]**:可能会产生过度匹配的问题。
>**决策树[适用数据类型]**：数值型和标称型。

-------------
[TOC]
 ------------
###决策树的一般流程
```
(1)收集数据：可以使用任何方法。
(2)准备数据：树构造算法只适用于标称型数据，因此数值型数据必须离散化。
(3)分析数据：可以使用任何方法，构造树完成之后，我们需要检验图形是否符合预期。
(4)训练算法：构造树的数据结构。
(5)测试算法：使用经验树计算错误率。
(6)使用算法：使用于任何监督学习算法。
```
###信息增益
>**划分数据集的最大原则**:将无序的数据集变的有序。
>**判断数据集的有序程度**:信息增益（熵），计算每个特征值划分数据集后获得的信息增益，获得信息增益最高的特征就是最好的选择。
>**信息增益[公式]**:
				 $$ H = - \sum_{i=1}^np(x_i)log_2p(x_i) $$
 **<font size=2>其中n是分类的数目。</font>**

###python决策树
#### 计算给定数据集的信息熵
```python 
from math import log

def calcShannonEnt(dataSet):
    numEntries = len(dataSet)
    labelCounts = {}
    for featVec in dataSet:
        currentLabel = featVec[-1]
        if currentLabel not in labelCounts.keys():
            labelCounts[currentLabel] = 0
            labelCounts[currentLabel] += 1
    shannonEnt = 0.0
    for key in labelCounts:
        prob = float(labelCounts[key]) / numEntries
        shannonEnt -= prob * log(prob,2)

    return shannonEnt

def createDataSet():
    dataSet = [[1,1,'yes'],
        [1,1,'yes'],
        [1,0,'no'],
        [0,1,'no'],
        [0,1,'no'],]
    labels = ['no surfacing','flippers']

    return dataSet,labels

myDat,labels = createDataSet()
print(myDat)
print(labels)
shannonEnt = calcShannonEnt(myDat)
print(shannonEnt)
```
#### 划分数据集
```python
import dtree
def splitDataset(dataSet,axis,value):
    retDataSet = []
    for featVec in dataSet:
        if featVec[axis] == value:
            reducedFeatVec = featVec[:axis]
            reducedFeatVec.extend(featVec[axis+1:])
            retDataSet.append(reducedFeatVec)

    return retDataSet

myData,labels = dtree.createDataSet()
print(myData)
retDataSet = splitDataset(myData,0,1)
print(retDataSet)
retDataSet = splitDataset(myData,0,0)
print(retDataSet)
```
####选择最好的数据划分方式
```python
def chooseBestFeatureToSplit(dataSet):
    numFeatures = len(dataSet[0]) - 1
    baseEntropy = dtree.calcShannonEnt(dataSet)
    bestInfoGain = 0.0
    bestFeature = -1
    for i in range(numFeatures):
        featList = [example[i] for example in dataSet]
        uniqueVals = set(featList)
        newEntropy = 0.0
        for value in uniqueVals:
            subDataSet = splitDataset(dataSet,i,value)
            prob = len(subDataSet)/float(len(dataSet))
            newEntropy += prob * dtree.calcShannonEnt(subDataSet)
        infoGain = baseEntropy - newEntropy
        if(infoGain > bestInfoGain):
            bestInfoGain = infoGain
            bestFeature = i
        return bestFeature

myData,labels = dtree.createDataSet()
print('myData:',myData)
bestFeature = chooseBestFeatureToSplit(myData)
print('bestFeature:',bestFeature)
```
#####结果输出
```
('myData:', [[1, 1, 'yes'], [1, 1, 'yes'], [1, 0, 'no'], [0, 1, 'no'], [0, 1, 'no']])
('bestFeature:', 0)
```
#####结果分析
```
运行结果表明第0个特征是最好用于划分数据集的特征，即数据集的的第一个参数，比如在该数据集中以第一个参数特征划分数据时，第一个分组中有3个，其中有一个被划分为no，第二个分组中全部属于no;当以第二个参数分组时，第一个分组中2个为yes,2个为no,第二个分类中只有一个no类。
```
###递归构建决策树
> **工作原理**：得到原始数据集，然后基于最好的属性值划分数据集，由于特征值可能多于2个，因此可能存在大于2个分支的数据集划分，在第一次划分后，数据将被传向树分支的下一个节点，在这个节点上我们可以再次划分数据。
> **递归条件**：程序遍历完所有划分数据集的属性，或者没个分支下的所有实例都具有相同的分类。
 
#### 构建递归决策树
```python
import dtree
import operator
def majorityCnt(classList):
    classCount = {}
    for vote in classList:
        if vote not in classCount.keys():
            classCount[vote] = 0
        classCount[vote] +=1

    sortedClassCount = sorted(classCount.iteritems(),key =  operator.itemgetter(1),reverse = True)
    return sortedClassCount[0][0]

def createTree(dataSet,labels):
    classList = [example[-1] for example in dataSet]
    if classList.count(classList[0]) == len(classList):
        return classList[0]
    if len(dataSet[0]) == 1:
        return majorityCnt(classlist)
    bestFeat = chooseBestFeatureToSplit(dataSet)
    bestFeatLabel = labels[bestFeat]
    myTree = {bestFeatLabel:{}}
    del(labels[bestFeat])
    featValues = [example[bestFeat] for example in dataSet]
    uniqueVals = set(featValues)
    for value in uniqueVals:
        subLabels = labels[:]
        myTree[bestFeatLabel][value] = createTree(splitDataset(dataSet,bestFeat,value),subLabels)

    return myTree


myData,labels = dtree.createDataSet()
print('myData:',myData)
myTree = createTree(myData,labels)
print('myTree:',myTree)
```
##### 结果输出
```
('myData:', [[1, 1, 'yes'], [1, 1, 'yes'], [1, 0, 'no'], [0, 1, 'no'], [0, 1, 'no']])
('myTree:', {'no surfacing': {0: 'no', 1: {'flippers': {0: 'no', 1: 'yes'}}}})
```
##### 结果分析
```
myTree 包含了树结构信息的前套字典，第一个关键字no surfacing是第一个划分数据集的特征名称，值为另一个数据字典，第二个关键字是no surfacing特征划分的数据集，是no surfacing的字节点，如果值是类标签，那么该节点为叶子节点，如果值是另一个数据字典，那么该节点是个判断节点，如此递归。
```
###测试算法:使用决策树执行分类
####使用决策树的分类函数
```python

import treeplotter
import dtree
def classify(inputTree,featLabels,testVec):
    firstStr = inputTree.keys()[0]
    secondDict = inputTree[firstStr]
    featIndex = featLabels.index(firstStr)
    for key in secondDict.keys():
        if testVec[featIndex] == key:
            if type(secondDict[key]).__name__=='dict':
                classLabel = classify(secondDict[key],featLabels,testVec)
            else:
                classLabel = secondDict[key]
    return classLabel

myDat,labels = dtree.createDataSet()
print(labels)
myTree = myTree = treeplotter.retrieveTree(0)
print(myTree)
print('classify(myTree,labels,[1,0]):',classify(myTree,labels,[1,0]))
print('classify(myTree,labels,[1,1]):',classify(myTree,labels,[1,1]))
```
#####结果输出
```
['no surfacing', 'flippers']
{'no surfacing': {0: 'no', 1: {'flippers': {0: 'no', 1: 'yes'}}, 3: 'maybe'}}
('classify(myTree,labels,[1,0]):', 'no')
('classify(myTree,labels,[1,1]):', 'yes')
```
####存储决策树
><font size=2>由于决策树的构造十分耗时，所以用创建好的决策树解决分类问题可以极大的提高效率。因此需要使用python模块pickle序列化对象，序列化对象可以在磁盘上保存对象，并在需要的地方读取出来，任何对象都可以执行序列化操作。</font>

```python 
#使用pickle模块存储决策树
import pickle
def storeTree(inputTree,filename):
    fw = open(filename,'w')
    pickle.dump(inputTree,fw)
    fw.close()

def grabTree(filename):
    fr = open(filename)
    return pickle.load(fr)
```
###决策树算法小结
> 决策树分类器就像带有终止块的流程图，终止块表示分类结果。首先我们需要测量集合数据中的熵即不一致性，然后寻求最优方案划分数据集，直到数据集中的所有数据属于同一分类。决策树的构造算法有很多版本，本文中用到的是ID3 ，最流行的是C4.5和CART。

