from rest_framework.response import Response
from django.shortcuts import render_to_response  
from django.http import HttpResponse
from django.template import RequestContext,Template
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth import  get_user_model
from rest_framework.decorators import api_view
from rest_framework import authentication, permissions,viewsets
import numpy as np
from rest_framework_jwt.settings import api_settings
from sklearn import preprocessing
from sklearn.decomposition import PCA
from .serializers import TaskSerializer
import csv
import json
import sys  
sys.path.append(r'E:\Anaconda\Scripts\CorsApi\snippets')
import naivebayes
import decisiontree

data_path = ""
ziduan_select = {}
line = []
sourceid=""
targetid=""
finalpath={}


@api_view(['GET', 'POST'])
def task_list(request):
    Method = request.method
    
    if request.method == 'GET':
        #serializer = TaskSerializer(data=request.data)
        
        return render(request, 'snippets/project.html', locals())

    elif request.method == 'POST':
        
        postBody = request.body
        json_result = json.loads(postBody)
        
        if json_result['type']=='delConnection':
            
            sourceid=json_result['sourceid']
            targetid=json_result['targetid']
            finalConnections(line, sourceid, targetid)
            resp={
                    'code' : '1'
                    }
            return HttpResponse(json.dumps(resp),content_type="application/json")
        
        if json_result['type']=='saveConnection':
            
            relId = json_result['relId']
            taskid = json_result['task.taskId']
            totaskId = json_result['toTaskId']
            sType = json_result['sourceType']
            tType = json_result['targetType']
    
            listtype = []
            listtype.append(sType)
            listtype.append(tType)   
            listid = []
            listid.append(taskid)
            listid.append(totaskId)    
            connections = {}
            connections['cid'] = relId
            connections['connids'] = listid
            connections['conntype'] = listtype   
            line.append(connections)
            resp={}
            return HttpResponse(json.dumps(resp),content_type="application/json")
        
        if json_result['type']=='delNode':
            
            endid=json_result['endid']          
            finalNode(line, endid)
            resp={}
            return HttpResponse(json.dumps(resp),content_type="application/json")
        
        if json_result['type']=='saveLine':
            
            endid=json_result['endid']
            endtype=json_result['endtype']
            finalline(line,endid,endtype)
            resp={}
            return HttpResponse(json.dumps(resp),content_type="application/json")
            
        if json_result['type']=='data_source':
            global filename
            filename = json_result['data']
            with open('E:/Anaconda/Scripts/CorsApi/snippets/Resource/‎file/'+json_result['data']+'.csv','rt',encoding="utf-8") as csvfile:
                reader = csv.reader(csvfile)
                rows = [row for row in reader]
            csvfile.close()
            
            global row
            row = rows[0]
            resp={
                    'attribute':row,
                    }
            
            return HttpResponse(json.dumps(resp),content_type="application/json")
        
        if json_result['type']=='field':
            column_data = {}
            for attribute in json_result['data']:
                with open('E:/Anaconda/Scripts/CorsApi/snippets/Resource/‎file/'+filename+'.csv','rt',encoding="utf-8") as csvfile:
                    inner_list=[]
                    reader = csv.DictReader(csvfile)               
                    column = [row[attribute] for row in reader]
                    if attribute!='result':
                        X = np.array(column,dtype=np.float64).reshape(-1,1)
                        min_max_scaler = preprocessing.MinMaxScaler()  
                        X_minMax = min_max_scaler.fit_transform(X) 
                        for n in X_minMax:
                        
                            inner_list.append(round(n[0],2))
                        column_data[attribute]=inner_list 
                    else:
                        rs=map(eval,column)
                        column_data[attribute]=list(rs)  
                        
                    
            
            resp={
                    'normalization':column_data,
                    }
            
            return HttpResponse(json.dumps(resp),content_type="application/json")
        
        if json_result['type']=='normal':
            column_data = {}
            data = json_result['data'] 
            for attribute in data:
                if attribute!='result':
                    X = np.array(column,dtype=np.float64).reshape(-1,1)
                    min_max_scaler = preprocessing.MinMaxScaler()  
                    X_minMax = min_max_scaler.fit_transform(X) 
                    for n in X_minMax:
                    
                        inner_list.append(round(n[0],2))
                    column_data[attribute]=inner_list 
                else:
                    rs=map(eval,column)
                    column_data[attribute]=list(rs)  
            resp={
                    'normalization':column_data,
                    
                    }
            
            return HttpResponse(json.dumps(resp),content_type="application/json")
        
        if json_result['type']=='pca':
             
            data = json_result['data'] 
            X = np,array(data)
            pca = PCA(n_components=2)
            ratio = pca.explained_variance_ratio_
            resp={
                    'ratio':ratio[0],
                    
                    }
            
            return HttpResponse(json.dumps(resp),content_type="application/json")
        
        if json_result['type']=='bayes':
             
            data = json_result['data'] 
            dataset,trainingSet,testSet,accuracy,result = naivebayes.bayes(data)
            attribute=[]
            for key in data.keys():
                attribute.append(key)
            
            resp={
                    'rows':len(dataset),
                    'train':len(trainingSet), 
                    'test':len(testSet),
                    'accuracy':accuracy,
                    'result':result,
                    'attribute':attribute,
                    }
            
            return HttpResponse(json.dumps(resp),content_type="application/json")
        
        if json_result['type']=='decision_tree':         
            max_depth = int(json_result['max_depth'])
            criterion = json_result['criterion']
            splitter = json_result['splitter']
            min_samples_split = int(json_result['min_samples_split'])
            data = json_result['data'] 
            score = decisiontree.dtree(max_depth,criterion,splitter,min_samples_split,data)
            
            resp={
                    'score':score,
                    }
            
            return HttpResponse(json.dumps(resp),content_type="application/json")
            
        if json_result['type']=='dtree_predict':
            a=[]
            dtree_predict= json_result['data']
            #dtree_predict = np.float64(dtree_predict)
            
            a.append(dtree_predict)
            pred = decisiontree.predict(a)
            
            resp={
                    'pred':[str(i) for i in pred],
                    }
            
            return HttpResponse(json.dumps(resp),content_type="application/json")    
    return render(request, 'snippets/project.html', locals())
   
   
def finalline(line,endid,endtype):
    i = 0
    new_list = line

    saveconns = []
    while i < len(new_list):
        if 'local'in new_list[i]['conntype'] or 'hive' in new_list[i]['conntype']:
            saveconns.append(new_list[i])
            new_list.remove(new_list[i])
            i=0
            break
        else:
            i += 1

    j=0
    while i<len(new_list) and j<len(saveconns):
        if saveconns[j]['connids'][1]==endid:
            break
        else :
            if saveconns[j]['connids'][1]==new_list[i]['connids'][0]:
                saveconns.append(new_list[i])
                new_list.remove(new_list[i])
                j+=1
                i=0
                if saveconns[j]['connids'][1] == endid:
                    break
            else:
                i+=1

    saveids=[]
    savetypes=[]
    for i in range(len(saveconns)):
        saveids.append(saveconns[i]['connids'][0])
        saveids.append(saveconns[i]['connids'][1])
        savetypes.append(saveconns[i]['conntype'][0])
        savetypes.append(saveconns[i]['conntype'][1])

    saveids1=list(set(saveids))
    saveids1.sort(key=saveids.index)

    savetypes1 = list(set(savetypes))
    savetypes1.sort(key=savetypes.index)

    finalpath['connid']=saveids1
    finalpath['conntype']=savetypes1


    json_dict=[]
    with open("E:/Anaconda/Scripts/CorsApi/snippets/static/connection.json",'r') as json_file:
        json_dict = json.load(json_file)
        json_dict.append(finalpath)
        print(json_dict)
        json_file.close()


    with open("E:/Anaconda/Scripts/CorsApi/snippets/static/connection.json",'w') as json_file:
        json_conn=json.dumps(json_dict,indent=4)
        json_file.write(json_conn)
        json_file.close()

    return finalpath

def finalConnections(connectionlist,sourceid,targetid):
    i=0
    while i<len(connectionlist):
        # print(connectionlist)
        evelist=connectionlist[i]['connids']
        if evelist[0]==sourceid and evelist[1]==targetid:
            connectionlist.remove(connectionlist[i])
        else:
            i+=1
    line=connectionlist
    # print("删除连线以后：")
    # print(line)

    return line       

def finalNode(connectionlist,endid):
    i=0
    # print("要删除的结点id信息："+endid)
    while i<len(connectionlist):
        eveidlist=connectionlist[i]['connids']
        if endid in eveidlist:
            connectionlist.remove(connectionlist[i])
        else:
            i=+1
    line = connectionlist
    # print("删除结点以后：")
    # print(line)

    return line

@api_view(['GET', 'PUT', 'DELETE'])
def task_detail(request, pk, format=None):
	try:
		task = Task.objects.get(pk=pk)
	except Task.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

	if request.method == 'GET':
		serializer = TaskSerializer(task)
		return Response(serializer.data)

	elif request.method == 'PUT':
		serializer = StoreSerializer(store, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	elif request.method == 'DELETE':
		task.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)
    

