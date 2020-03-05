$.ajax({
    url: 'CSV/bloomPollData.csv',
    dataType: 'text',
  }).done(successFunction);

function elementInArray(element,array){
  for(var i=0;i<array.length;i++){
    if (element == array[i]){
      return true;
    }
  }
  return false;
}

function getList(colIndex,dataRows){
  var list = [];
  for (var singleRow = 0; singleRow < dataRows.length; singleRow++) {
    var uniqueName = dataRows[singleRow].split(',')[colIndex]
    if (!elementInArray(uniqueName,list)){
      list.push(uniqueName);
    }
  }
  return list;
}

function fillSelector(list,name){
  for (var i = 0;i<list.length;i++){
    $('#'+name).append('<option value="'+list[i]+'">'+list[i]+"</option");
  }
}

function populateStateData(allRows,stateIndex,rowsOfInterest,voteCountIndex){
  
  rowOfInterest = 0;
      for (var i=0;i<rowsOfInterest.length;i++){
        if ($("#state").val()==allRows[rowsOfInterest[i]].split(',')[stateIndex]){
          rowOfInterest = rowsOfInterest[i];
        }
      }
      voteCount = allRows[rowOfInterest].split(',')[voteCountIndex];
      document.getElementById('voteCount').innerHTML = voteCount;
}

function successFunction(data) {
    var allRows = data.split(/\r?\n|\r/);
    var candIndex = allRows[0].split(',').indexOf('Candidate');
    var stateIndex = allRows[0].split(',').indexOf('state');
    var candidateList = getList(candIndex,allRows);
    var stateList = getList(stateIndex,allRows);

    fillSelector(candidateList,'Candidate');
    fillSelector(stateList,'state');

    var rowsOfInterest = [];
    var delCountIndex = allRows[0].split(',').indexOf('delegates_total');
    var droppedIndex = allRows[0].split(',').indexOf('dropped_out');
    $("#Candidate").change(function(){
      rowsOfInterest = [];
      for (var i = 0;i<allRows.length;i++){
        if (allRows[i].split(',')[candIndex]==$("#Candidate").val()){
          rowsOfInterest.push(i);
        }
      }
      delCount = allRows[rowsOfInterest[0]].split(',')[delCountIndex];
      dropped = allRows[rowsOfInterest[0]].split(',')[droppedIndex];
      document.getElementById('delegateCount').innerHTML = delCount;
      document.getElementById('dropped').innerHTML = dropped;
      populateStateData(allRows,stateIndex,rowsOfInterest,voteCountIndex);
    });

    var voteCountIndex = allRows[0].split(',').indexOf('vote_count');
    $("#state").change(function(){
      populateSateData(allRows,stateIndex,rowsOfInterest,voteCountIndex);
    });

  }