// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE file in the project root for full license information.

exports.lastTransform = function (model) {

  if (model.isCollection) {
    return model;
  }

  if (model.children) {

    for (let i = 0; i < model.children.length; i++) {
      var topChild = model.children[i];

      if (topChild.inMethod && topChild.children) {

        var addedMethodNames = {};
        var uniqueMethodsInOrder = [];

        for (let j = 0; j < topChild.children.length; j++) {
          var lowerChild = topChild.children[j];

          var methodNameWithParams = lowerChild.name[0].value;
          var methodNameOnly = FindNameOnly(methodNameWithParams);

          if (!addedMethodNames.hasOwnProperty(methodNameOnly)) {
            addedMethodNames[methodNameOnly] = true;

            lowerChild.shortName = [
              {
                "lang": "csharp",
                "value": methodNameOnly
              },
              {
                "lang": "vb",
                "value": methodNameOnly
              }
            ];

            uniqueMethodsInOrder.push(lowerChild);
          }
        }

        topChild.children = uniqueMethodsInOrder;

      }

    }




  }

  return model;
}

function FindNameOnly(methodNameWithParams) {
  var symbolIndex = methodNameWithParams.indexOf('<');
  var bracesIndex = methodNameWithParams.indexOf('(');

  //there is always braces index but not the symbol index
  if (symbolIndex < 0) {
    var name = methodNameWithParams.slice(0, bracesIndex);
    return name;
  }

  var finalIndex = Math.min(symbolIndex, bracesIndex);
  if (finalIndex > 0) {
    var name = methodNameWithParams.slice(0, finalIndex);
    return name;
  }

  console.err("The method doesn't have ( or ` in it's name. Something is not right!");
  return "";
}