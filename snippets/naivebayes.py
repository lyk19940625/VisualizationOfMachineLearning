#-*- coding: utf-8 -*-
# Example of Naive Bayes implemented from Scratch in Python
import csv
import random
import math
import pandas as pd
import numpy as np
from matplotlib import pyplot as plt 

    
def loadCsv(data):
    dataset=[]
    for n in range(len(data['结果'])):
        a=[]
        for key in data.keys():
            a.append(data[key][n])
        dataset.append(a)
    
    return dataset


        

def splitDataset(dataset, splitRatio):
	trainSize = int(len(dataset) * splitRatio)
	trainSet = []
	copy = list(dataset)
	while len(trainSet) < trainSize:
		index = random.randrange(len(copy))
		trainSet.append(copy.pop(index))
	return [trainSet, copy]

def separateByClass(dataset):
	separated = {}
	for i in range(len(dataset)):
		vector = dataset[i]
		if (vector[-1] not in separated):
			separated[vector[-1]] = []
		separated[vector[-1]].append(vector)
	return separated

def mean(numbers): 
    return sum(numbers)/float(len(numbers))

def stdev(numbers):
	avg = mean(numbers)
	variance = sum([pow(x-avg,2) for x in numbers])/float(len(numbers)-1)
	return math.sqrt(variance)

def summarize(dataset):
	summaries = [(mean(attribute), stdev(attribute)) for attribute in zip(*dataset)]
	del summaries[-1]
	return summaries

def summarizeByClass(dataset):
	separated = separateByClass(dataset)
	summaries = {}
	for classValue, instances in separated.items():
		summaries[classValue] = summarize(instances)
	return summaries

def calculateProbability(x, mean, stdev):
	exponent = math.exp(-(math.pow(float(x)-float(mean),2)/(2*math.pow(stdev,2))))
	return (1 / (math.sqrt(2*math.pi) * stdev)) * exponent

def calculateClassProbabilities(summaries, inputVector):
	probabilities = {}
	for classValue, classSummaries in summaries.items():
		probabilities[classValue] = 1
		for i in range(len(classSummaries)):
			mean, stdev = classSummaries[i]
			x = inputVector[i]
			probabilities[classValue] *= calculateProbability(x, mean, stdev)
	return probabilities

def predict(summaries, inputVector):
	probabilities = calculateClassProbabilities(summaries, inputVector)
	bestLabel, bestProb = None, -1
	for classValue, probability in probabilities.items():
		if bestLabel is None or probability > bestProb:
			bestProb = probability
			bestLabel = classValue
	return bestLabel

def getPredictions(summaries, testSet):
    predictions = []
    for i in range(len(testSet)):
        result = predict(summaries, testSet[i])
        predictions.append(result)
    
    return predictions

def getAccuracy(testSet, predictions):
	correct = 0
	for i in range(len(testSet)):
		if testSet[i][-1] == predictions[i]:
			correct += 1
	return correct

def predict_result(testSet,predictions):
    result_final = []
    for i in range(len(testSet)):  
        testSet[i].append(float(predictions[i]))
           
        result_final.append(testSet[i])
    return result_final

def show(testSet,accuracy):
    
    plt.figure(figsize=(6,9))
    #定义饼状图的标签，标签是列表
    labels = [u'accuracy',u'error']
    #每个标签占多大，会自动去算百分比
    sizes = [accuracy,len(testSet)-accuracy]
    colors = ['red','yellowgreen']
    #将某部分爆炸出来， 使用括号，将第一块分割出来，数值的大小是分割出来的与其他两块的间隙
    explode = (0.05,0)
    patches,l_text,p_text = plt.pie(sizes,explode=explode,labels=labels,colors=colors,
                                labeldistance = 1.1,autopct = '%3.1f%%',shadow = False,
                                startangle = 90,pctdistance = 0.6)
    for t in l_text:
        t.set_size=(30)
    for t in p_text:
        t.set_size=(20)
    # 设置x，y轴刻度一致，这样饼图才能是圆的
    plt.axis('equal')
    plt.legend()
    plt.title('Naive Bayes Classifier', bbox={'facecolor':'0.6', 'pad':4})
    #plt.figure(figsize=(4, 3))
    plt.savefig('E:/Anaconda/Scripts/CorsApi/snippets/static/picture/bayes.jpg',format='png')
    plt.close()

def bayes(data):

    splitRatio = 0.67
    
    dataset = loadCsv(data)
   
    trainingSet, testSet = splitDataset(dataset, splitRatio)
    #print('Split {0} rows into train={1} and test={2} rows'.format(len(dataset), len(trainingSet), len(testSet)))
    # prepare model
    summaries = summarizeByClass(trainingSet)
    # test model
    predictions = getPredictions(summaries, testSet)
    accuracy = getAccuracy(testSet, predictions)
    #print('Accuracy: {0}%'.format(accuracy))
    result = predict_result(testSet,predictions)
    show(testSet,accuracy)
    return dataset,trainingSet,testSet,accuracy,result
    
    

