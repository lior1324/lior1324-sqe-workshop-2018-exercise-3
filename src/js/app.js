import $ from 'jquery';
const viz = require('viz.js');
import {getTextFinished} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let vars= $('#parameterInput').val();
        var table = document.getElementById('grandTable');
        var row = table.rows[1];
        var cell = row.cells[1];
        var stringGraph=getTextFinished(codeToParse,vars);
        var showAsHtml=viz('digraph {'+stringGraph+'}');
        cell.innerHTML=showAsHtml;
    });
});
