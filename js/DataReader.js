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

function getUniqueList(colIndex,dataRows){
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

function populateData(allRows,rowsOfInterest,class_){
  rowOfInterest = 0;
  var classIndex = allRows[0].split(',').indexOf(class_);
  for (var i=0;i<rowsOfInterest.length;i++){
    if ($("#"+class_).val()==allRows[rowsOfInterest[i]].split(',')[classIndex]){
      rowOfInterest = rowsOfInterest[i];
    }
  }
  $("."+class_).each(function(index) {
    var fieldName = $(this).attr('id');
    var colIndex = allRows[0].split(',').indexOf(fieldName);
    var count = allRows[rowOfInterest].split(',')[colIndex];
    document.getElementById(fieldName).innerHTML = count;
  });
}

function successFunction(data) {
    var allRows = data.split(/\r?\n|\r/);
    var candIndex = allRows[0].split(',').indexOf('Candidate');
    var stateIndex = allRows[0].split(',').indexOf('state');
    var candidateList = getUniqueList(candIndex,allRows);
    var stateList = getUniqueList(stateIndex,allRows);

    fillSelector(candidateList,'Candidate');
    fillSelector(stateList,'state');

    var rowsOfInterest = [];
    $("#Candidate").change(function(){
      rowsOfInterest = [];
      for (var i = 0;i<allRows.length;i++){
        if (allRows[i].split(',')[candIndex]==$("#Candidate").val()){
          rowsOfInterest.push(i);
        }
      }
      populateData(allRows,rowsOfInterest,'Candidate')
      populateData(allRows,rowsOfInterest,'state');
    });

    $("#state").change(function(){
      populateData(allRows,rowsOfInterest,'state');
    });

  }

$(".set").click(function(){
  var dim = $(this).attr('class')[4];
  var vari = $(this).attr('for');
  document.getElementById(dim).innerHTML = document.getElementById(vari).innerHTML;
  document.getElementById(dim).value = document.getElementById(vari).innerHTML;
});