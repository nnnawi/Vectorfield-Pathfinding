if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
  } else {
    ready();
}

function ready(){
    create_collapsable();
}

function create_collapsable(){
    var collapsable_buttons = document.getElementsByClassName("collapsible");
    for(i = 0;i < collapsable_buttons.length;i++){
        var current_button = collapsable_buttons[i];
        current_button.addEventListener('click',function(){
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if(content.style.display === "block"){
                content.style.display= "none";
            }
            else{
                content.style.display = "block";
            }
        });
    }
}