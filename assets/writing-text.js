(function($) {
    var T, 
    write = {
        settings: {
            letters: $('.writing-text'),
        },
        init: function() {
            T = this.settings;
            var self = this;
            this.putIntab();
        },
        putIntab: function(){
            for(var i=0; i<T.letters.length; i++){
                var tableau = $.trim(T.letters[i].innerHTML).split(/(?=[^>]*(?:<|$))/);
                T.letters[i].innerText = " ";
                this.afficheDelay(i, tableau);
            }
        },
        afficheDelay: function(champ, texte){
            var y = 0;
            var self = this;
            var affiche = setInterval(function(){
                var lettre = texte[y];
                $("<span>"+lettre+"</span>").appendTo(self.settings.letters[champ]);
                y++;
                if (y == texte.length){
                    clearInterval(affiche);
                }
            }, 60); // temps entre chaque caractères
        },
    };
    write.init();
})(jQuery);
