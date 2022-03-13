if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
  } else {
    ready();
}

function ready(){
    var input_equation = document.getElementsByClassName("formula")[0];
    input_equation.addEventListener('input', function(event){
        input_formula = event.target.getValue('ascii-math');
    })
}