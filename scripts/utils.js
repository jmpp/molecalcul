(function(app) {
  'use strict';

  app.utils = {
    slowDown   : slowDown,
    calculator : calculator,
    noop : function () {}
  };

  /**
   * Permet de faire ralentir progressivement une propriété de vitesse d'un body
   * @param {Number} prop Valeur numérique devant être ralentie
   * @param {Number} by Valeur du ralentissement par frame
   */
  function slowDown(prop, by) {
    by = by || 1;

    if (prop !== 0) {
      if (prop > 0)
        prop -= by;
      else if (prop < 0)
        prop += by;

      if (Math.abs(prop) < by)
        prop = 0;
    }

    return prop;
  }

  /**
   * Fonction renvoyant une fonction qui permet de faire des opérations
   * @param {String} op Caractère représenter le type d'opération à effectuer par la fonction de renvoi
   */
  function calculator(op) {
    switch (op) {
      case '–':
        return (a, b) => a - b;
        break;
      case '×':
        return (a, b) => a * b;
        break;
      case '÷':
        return (a, b) => Math.round(a / b);
        break;
      default :
        return (a, b) => a + b;
        break;
    }
  }
  
})(window.app);