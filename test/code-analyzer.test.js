import assert from 'assert';
import {getTextFinished} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing test #1 aviram', () => { //1
        assert.equal(
            getTextFinished('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '    } else if (b < z * 2) {\n' +
                '        c = c + x + 5;\n' +
                '    } else {\n' +
                '        c = c + z + 5;\n' +
                '    }\n' +
                '    \n' +
                '    return c;\n' +
                '}\n','1,2,3'),
            'n1 [label="1. a = (x + 1)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n2 [label="2. b = (a + y)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n3 [label="3. c = 0", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n4 [label="4. b < z", shape=diamond, style = filled, fillcolor=green]\n' +
            'n5 [label="9. c = (c + 5)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n6 [label="7. return c", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n7 [label="5. b < (z * 2)", shape=diamond, style = filled, fillcolor=green]\n' +
            'n8 [label="8. c = ((c + x) + 5)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n9 [label="6. c = ((c + z) + 5)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 [label="T"]\n' +
            'n4 -> n7 [label="F"]\n' +
            'n5 -> n6 []\n' +
            'n7 -> n8 [label="T"]\n' +
            'n7 -> n9 [label="F"]\n' +
            'n8 -> n6 []\n' +
            'n9 -> n6 []'
        );
    });
    it ('is parsing test #2 aviram',()=>{// 2
        assert.equal(
            getTextFinished('function foo(x, y, z){\n' +
                '   let a = x + 1;\n' +
                '   let b = a + y;\n' +
                '   let c = 0;\n' +
                '   \n' +
                '   while (a < z) {\n' +
                '       c = a + b;\n' +
                '   }\n' +
                '   \n' +
                '   return z;\n' +
                '}\n','1,2,3'),
            'n1 [label="1. a = (x + 1)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n2 [label="2. b = (a + y)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n3 [label="3. c = 0", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n4 [label="4. a < z", shape=diamond, style = filled, fillcolor=green]\n' +
            'n5 [label="6. c = (a + b)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n6 [label="5. return z", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 [label="T"]\n' +
            'n4 -> n6 [label="F"]\n' +
            'n5 -> n4 []'
        );
    });
    it ('parsing local vars with diffrent items',()=>{// 3
        assert.equal(
            getTextFinished('function foo(x, y, z){\n' +
                '   let a = x + 1;\n' +
                '   let b = a + y;\n' +
                '   let c = 0;\n' +
                '   let d,e;\n' +
                '   let f=[1,\'d\',"fa",true,false];\n' +
                '   let g=f[0];\n' +
                '   \n' +
                '   while (a > z) {\n' +
                '       c = a + b;\n' +
                '   }\n' +
                '   \n' +
                '   return z;\n' +
                '}\n','1,2,3'),
            'n1 [label="1. a = (x + 1)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n2 [label="2. b = (a + y)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n3 [label="3. c = 0", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n4 [label="4. d, e", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n5 [label="5. f = [1, \'d\', \'fa\', true, false]", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n6 [label="6. g = f[0]", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n7 [label="7. a > z", shape=diamond, style = filled, fillcolor=green]\n' +
            'n8 [label="9. c = (a + b)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n9 [label="8. return z", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 []\n' +
            'n5 -> n6 []\n' +
            'n6 -> n7 []\n' +
            'n7 -> n8 [label="T"]\n' +
            'n7 -> n9 [label="F"]\n' +
            'n8 -> n7 []'
        );
    });
    it ('',()=>{// 4
        assert.equal(
            getTextFinished('function foo(x, y, z){\n' +
                '   let a = x + 1;\n' +
                '   let b = a + y;\n' +
                '   let c = 0;\n' +
                '   let d,e;\n' +
                '   let f=[1,\'d\',"fa",true,false];\n' +
                '   let g=1+f[0];\n' +
                '   let h=-5;\n' +
                '   \n' +
                '   while (a > z) {\n' +
                '       c = a + b;\n' +
                '   }\n' +
                '   \n' +
                '   return z;\n' +
                '}\n','1,2,3'),
            'n1 [label="1. a = (x + 1)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n2 [label="2. b = (a + y)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n3 [label="3. c = 0", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n4 [label="4. d, e", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n5 [label="5. f = [1, \'d\', \'fa\', true, false]", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n6 [label="6. g = (1 + f[0])", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n7 [label="7. h = - (5)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n8 [label="8. a > z", shape=diamond, style = filled, fillcolor=green]\n' +
            'n9 [label="10. c = (a + b)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n10 [label="9. return z", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 []\n' +
            'n5 -> n6 []\n' +
            'n6 -> n7 []\n' +
            'n7 -> n8 []\n' +
            'n8 -> n9 [label="T"]\n' +
            'n8 -> n10 [label="F"]\n' +
            'n9 -> n8 []'
        );
    });
    it ('',()=>{// 5
        assert.equal(
            getTextFinished('function foo(x, y, z){\n' +
                '   let a = x + 1;\n' +
                '   let b = a + y;\n' +
                '   let c = 0;\n' +
                '   let d,e;\n' +
                '   let f=[1,\'d\',"fa",true,false];\n' +
                '   let g=1+f[0];\n' +
                '   let h=((-5)+7);\n' +
                '   f[0]=3;\n' +
                '   \n' +
                '   while (a > z) \n' +
                '       c = a + b;\n' +
                'if(a>z)\n' +
                'c=a;\n' +
                '   \n' +
                '   \n' +
                '   return z;\n' +
                '}\n','1,2,3'),
            'n1 [label="1. a = (x + 1)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n2 [label="2. b = (a + y)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n3 [label="3. c = 0", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n4 [label="4. d, e", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n5 [label="5. f = [1, \'d\', \'fa\', true, false]", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n6 [label="6. g = (1 + f[0])", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n7 [label="7. h = (- (5) + 7)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n8 [label="8. f[0] = 3", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n9 [label="9. a > z", shape=diamond, style = filled, fillcolor=green]\n' +
            'n10 [label="13. c = (a + b)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n11 [label="10. a > z", shape=diamond, style = filled, fillcolor=green]\n' +
            'n12 [label="12. c = a", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n13 [label="11. return z", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 []\n' +
            'n5 -> n6 []\n' +
            'n6 -> n7 []\n' +
            'n7 -> n8 []\n' +
            'n8 -> n9 []\n' +
            'n9 -> n10 [label="T"]\n' +
            'n9 -> n11 [label="F"]\n' +
            'n10 -> n9 []\n' +
            'n11 -> n12 [label="T"]\n' +
            'n11 -> n13 [label="F"]\n' +
            'n12 -> n13 []'
        );
    });
    /*it ('',()=>{// 6
        assert.equal(
            getTextFinished('',''),
            ''
        );
    });
    it ('',()=>{// 7
        assert.equal(
            getTextFinished('',''),
            ''
        );
    });
    it ('',()=>{// 8
        assert.equal(
            getTextFinished('',''),
            ''
        );
    });
    it ('',()=>{// 9
        assert.equal(
            getTextFinished('',''),
            ''
        );
    });
    it ('',()=>{// 10
        assert.equal(
            getTextFinished('',''),
            ''
        );
    });
    it ('',()=>{// 11
        assert.equal(
            getTextFinished('',''),
            ''
        );
    });*/
});
