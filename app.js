updateTextfield = function (slider, textFld) {
  var sliderComp = document.getElementById(slider),
    textfieldComp = document.getElementById(textFld),
    principalAmtComp = document.getElementById("principalAmt"),
    _this = this;
  textfieldComp.value = sliderComp.value;
  sliderComp.oninput = function () {
    textfieldComp.value = this.value;
    _this.updateMonthlyEMIInterestPayable();
  }
  //Update Pricipal amount on bottom
  if (slider == "loanAmtSlider") {
    principalAmtComp.value = sliderComp.value.toLocaleString();
    sliderComp.oninput = function () {
      principalAmtComp.value = this.value;
      _this.updateMonthlyEMIInterestPayable();
    }
  }
}
updateMonthlyEMIInterestPayable = function (returnTotalAmt) {
  var principalAmtComp = document.getElementById("principalAmt"),
    interestRate = document.getElementById("interestRateTextfld").value,
    noOfMonths = document.getElementById("loanTermTextfld").value * 12,
    principalAmt = principalAmtComp.value;

  let interest1 = interestRate / 1200;
  let term = noOfMonths;
  let top = Math.pow((1 + interest1), term);
  let bottom = top - 1;
  let ratio = top / bottom;
  let EMI = principalAmt * interest1 * ratio;
  let Total = (EMI * term).toFixed(0);
  if (returnTotalAmt) {
    return Total;
  }
  else {
    document.getElementById("emiValue").value = (EMI.toFixed(0));
    document.getElementById("interestAmt").value = (Total - principalAmt);
  }
  this.drawChart(true,(EMI.toFixed(0)),principalAmt,(Total - principalAmt));
}
drawChart = function(redrawChart,EMI,Pricipal,Interest){
  var data;
  if(redrawChart){
    document.getElementById("chartContainer").innerHTML = "";
    data = anychart.data.set([
      ['Monthly EMI', EMI],
      ['Principal', Pricipal],
      ['Interest Payable', Interest]
    ]);
  }
  else{
    data = anychart.data.set([
      ['Monthly EMI', 25176],
      ['Principal', 3000000],
      ['Interest Payable', 4552767]
    ]);
  }
  var chart = anychart.pie(data);
  var palette = anychart.palettes.distinctColors();
  palette.items([  //Set the colors accordingly
    { color: '#ffa500' },
    { color: '#7cb5ec' },
    { color: '#ffa500' }
  ]);
  chart.background().stroke({color: "#F5F5F5", thickness: 10});
  chart.background().cornerType("round");
  chart.background().corners(10, 10, 10, 10); 
  chart.innerRadius('83%')    //setting chart radius to make a donut chart
  chart.palette(palette);
  chart.labels().format('{%x} — {%y}%').fontSize(16);
  chart.legend(true);
  chart.legend = {
    enabled: true,
    align: 'center',
    verticalAlign: 'bottom',
    layout: 'horizontal',
    margin: '50 50 0 50'
  };
  var label = anychart.standalones.label();
  var totalAmt = this.updateMonthlyEMIInterestPayable(true);
  label
    .useHtml(true)
    .text(
      '<span style="color:#333333;font-size:18px;fill:#333333;">Total Amount<br/><span style="color:#444857; font-size: 14px;">(Loan+Interest)</span></span>' +
      '<br/><span type=number id="totalAmount" style="color:#444857; font-style:font-size: 25px !important;">' + totalAmt + '</span>'
    )
    .position('center')
    .anchor('center')
    .hAlign('center')
    .vAlign('middle');
  chart.center().content(label);   // set the label as the center content
  chart.container('chartContainer');
  chart.draw();
}
anychart.onDocumentReady(function () {
  this.drawChart(false);
});
