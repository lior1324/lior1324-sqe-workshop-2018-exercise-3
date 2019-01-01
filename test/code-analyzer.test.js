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
    it ('parsing local vars with diffrent items #1',()=>{// 3
        assert.equal(
            getTextFinished('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    let d,e;\n' +
                '    let f=[1,\'d\',"d",true,false];\n' +
                '    let g=f[0];\n' +
                '\n' +
                '    while (a < z) {\n' +
                '    c = a + b;\n' +
                '    }\n' +
                '    \n' +
                '    return c;\n' +
                '}\n','1,2,3'),
            'n1 [label="1. a = (x + 1)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n2 [label="2. b = (a + y)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n3 [label="3. c = 0", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n4 [label="4. d, e", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n5 [label="5. f = [1, \'d\', \'d\', true, false]", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n6 [label="6. g = f[0]", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n7 [label="7. a < z", shape=diamond, style = filled, fillcolor=green]\n' +
            'n8 [label="9. c = (a + b)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n9 [label="8. return c", shape=rectangle, style = filled, fillcolor=green]\n' +
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
    });// continue from here next time...
    it ('parsing local vars with diffrent items #2',()=>{// 4
        assert.equal(
            getTextFinished('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    let f=[1,\'d\',"fa",true,false];\n' +
                '    let g=1+f[0];\n' +
                '    let h=-5;\n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '       } else if (b < z * 2) {\n' +
                '           c = c + x + 5;\n' +
                '        } else {\n' +
                '        c = c + z + 5;\n' +
                '    }\n' +
                '    return c;\n' +
                '}\n','1,2,3'),
            'n1 [label="1. a = (x + 1)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n2 [label="2. b = (a + y)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n3 [label="3. c = 0", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n4 [label="4. f = [1, \'d\', \'fa\', true, false]", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n5 [label="5. g = (1 + f[0])", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n6 [label="6. h = - (5)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n7 [label="7. b < z", shape=diamond, style = filled, fillcolor=green]\n' +
            'n8 [label="12. c = (c + 5)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n9 [label="10. return c", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n10 [label="8. b < (z * 2)", shape=diamond, style = filled, fillcolor=green]\n' +
            'n11 [label="11. c = ((c + x) + 5)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n12 [label="9. c = ((c + z) + 5)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 []\n' +
            'n5 -> n6 []\n' +
            'n6 -> n7 []\n' +
            'n7 -> n8 [label="T"]\n' +
            'n7 -> n10 [label="F"]\n' +
            'n8 -> n9 []\n' +
            'n10 -> n11 [label="T"]\n' +
            'n10 -> n12 [label="F"]\n' +
            'n11 -> n9 []\n' +
            'n12 -> n9 []'
        );
    });
    it ('',()=>{// 5
        assert.equal(
            getTextFinished('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    let f=[1,\'d\',"fa",true,false];\n' +
                '     let g=1+f[0];\n' +
                '       let h=((-5)+7);\n' +
                '       f[0]=3;\n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '       } else if (b < z * 2) {\n' +
                '           c = c + x + 5;\n' +
                '        } else {\n' +
                '        c = c + z + 5;\n' +
                '    }\n' +
                '    return c;\n' +
                '}\n','1,2,3'),
            'n1 [label="1. a = (x + 1)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n2 [label="2. b = (a + y)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n3 [label="3. c = 0", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n4 [label="4. f = [1, \'d\', \'fa\', true, false]", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n5 [label="5. g = (1 + f[0])", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n6 [label="6. h = (- (5) + 7)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n7 [label="7. f[0] = 3", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n8 [label="8. b < z", shape=diamond, style = filled, fillcolor=green]\n' +
            'n9 [label="13. c = (c + 5)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n10 [label="11. return c", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n11 [label="9. b < (z * 2)", shape=diamond, style = filled, fillcolor=green]\n' +
            'n12 [label="12. c = ((c + x) + 5)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n13 [label="10. c = ((c + z) + 5)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 []\n' +
            'n5 -> n6 []\n' +
            'n6 -> n7 []\n' +
            'n7 -> n8 []\n' +
            'n8 -> n9 [label="T"]\n' +
            'n8 -> n11 [label="F"]\n' +
            'n9 -> n10 []\n' +
            'n11 -> n12 [label="T"]\n' +
            'n11 -> n13 [label="F"]\n' +
            'n12 -> n10 []\n' +
            'n13 -> n10 []'
        );
    });
    it ('',()=>{// 6
        assert.equal(
            getTextFinished('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '     let d =[1,2,3];\n' +
                '   let e =d[x];   \n' +
                'let f=d[1+d[0]];   \n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '       } else if (b < z * 2) {\n' +
                '           c = c + x + 5;\n' +
                '        } else {\n' +
                '        c = c + z + 5;\n' +
                '    }\n' +
                '    return c;\n' +
                '}\n','1,2,3'),
            'n1 [label="1. a = (x + 1)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n2 [label="2. b = (a + y)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n3 [label="3. c = 0", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n4 [label="4. d = [1, 2, 3]", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n5 [label="5. e = d[x]", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n6 [label="6. f = d[(1 + d[0])]", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n7 [label="7. b < z", shape=diamond, style = filled, fillcolor=green]\n' +
            'n8 [label="12. c = (c + 5)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n9 [label="10. return c", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n10 [label="8. b < (z * 2)", shape=diamond, style = filled, fillcolor=green]\n' +
            'n11 [label="11. c = ((c + x) + 5)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n12 [label="9. c = ((c + z) + 5)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 []\n' +
            'n5 -> n6 []\n' +
            'n6 -> n7 []\n' +
            'n7 -> n8 [label="T"]\n' +
            'n7 -> n10 [label="F"]\n' +
            'n8 -> n9 []\n' +
            'n10 -> n11 [label="T"]\n' +
            'n10 -> n12 [label="F"]\n' +
            'n11 -> n9 []\n' +
            'n12 -> n9 []'
        );
    });
    it ('',()=>{// 7
        assert.equal(
            getTextFinished('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    let d =[1,2,3];\n' +
                '    let e= x;\n' +
                '    let f= d[(1+d[0])];\n' +
                '    let g = e/x;\n' +
                '    let h=e-x;\n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '       } else if (b < z * 2) {\n' +
                '           c = c + x + 5;\n' +
                '        } else {\n' +
                '        c = c + z + 5;\n' +
                '    }\n' +
                '    return c;\n' +
                '}\n','1,2,3'),
            'n1 [label="1. a = (x + 1)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n2 [label="2. b = (a + y)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n3 [label="3. c = 0", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n4 [label="4. d = [1, 2, 3]", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n5 [label="5. e = x", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n6 [label="6. f = d[(1 + d[0])]", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n7 [label="7. g = (e / x)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n8 [label="8. h = (e - x)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n9 [label="9. b < z", shape=diamond, style = filled, fillcolor=green]\n' +
            'n10 [label="14. c = (c + 5)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n11 [label="12. return c", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n12 [label="10. b < (z * 2)", shape=diamond, style = filled, fillcolor=green]\n' +
            'n13 [label="13. c = ((c + x) + 5)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n14 [label="11. c = ((c + z) + 5)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 []\n' +
            'n5 -> n6 []\n' +
            'n6 -> n7 []\n' +
            'n7 -> n8 []\n' +
            'n8 -> n9 []\n' +
            'n9 -> n10 [label="T"]\n' +
            'n9 -> n12 [label="F"]\n' +
            'n10 -> n11 []\n' +
            'n12 -> n13 [label="T"]\n' +
            'n12 -> n14 [label="F"]\n' +
            'n13 -> n11 []\n' +
            'n14 -> n11 []'
        );
    });
    it ('',()=>{// 8
        assert.equal(
            getTextFinished('function foo(x, y, z){\n' +
                '    let a = x[0] + 1;\n' +
                '      let b = a + y;\n' +
                '  let c = 0;\n' +
                '    x[0]=1;\n' +
                '      if (\'d\' == "d") {\n' +
                '          c = c + 5;\n' +
                '      } else if (b > 100) {\n' +
                '         c = c + x[1] + 5;\n' +
                '        }else \n' +
                '        c = c + z + 5;\n' +
                '\n' +
                '    return c;\n' +
                '}\n','[1,2,3],2,3'),
            'n1 [label="1. a = (x[0] + 1)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n2 [label="2. b = (a + y)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n3 [label="3. c = 0", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n4 [label="4. x[0] = 1", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n5 [label="5. \'d\' == \'d\'", shape=diamond, style = filled, fillcolor=green]\n' +
            'n6 [label="10. c = (c + 5)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n7 [label="8. return c", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n8 [label="6. b > 100", shape=diamond, style = filled, fillcolor=white]\n' +
            'n9 [label="9. c = ((c + x[1]) + 5)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n10 [label="7. c = ((c + z) + 5)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 []\n' +
            'n5 -> n6 [label="T"]\n' +
            'n5 -> n8 [label="F"]\n' +
            'n6 -> n7 []\n' +
            'n8 -> n9 [label="T"]\n' +
            'n8 -> n10 [label="F"]\n' +
            'n9 -> n7 []\n' +
            'n10 -> n7 []'
        );
    });
    it ('',()=>{// 9
        assert.equal(
            getTextFinished('function foo(x, y, z,w,v,u,s,t){\n' +
                '    let a = x[0] + 1;\n' +
                '    let b = a + y;\n' +
                '   let c = 0;\n' +
                '   x[0]=1;\n' +
                '    x[0]=x[0]/x[0];\n' +
                '     x[0]=x[0]-x[0];\n' +
                '   let f=-7*x[0];\n' +
                '   if (\'d\' == "d") {\n' +
                '    c = c + 5;\n' +
                '   } else if (b > 100) {\n' +
                '      c = c + x[1] + 5;\n' +
                '     } else \n' +
                '        c = c + z + 5;\n' +
                '\n' +
                '    return c;\n' +
                '}','[1,2,true,false,\'d\'],2,3,true,false,\'d\',"d",1.5'),
            'n1 [label="1. a = (x[0] + 1)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n2 [label="2. b = (a + y)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n3 [label="3. c = 0", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n4 [label="4. x[0] = 1", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n5 [label="5. x[0] = (x[0] / x[0])", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n6 [label="6. x[0] = (x[0] - x[0])", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n7 [label="7. f = (- (7) * x[0])", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n8 [label="8. \'d\' == \'d\'", shape=diamond, style = filled, fillcolor=green]\n' +
            'n9 [label="13. c = (c + 5)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n10 [label="11. return c", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n11 [label="9. b > 100", shape=diamond, style = filled, fillcolor=white]\n' +
            'n12 [label="12. c = ((c + x[1]) + 5)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n13 [label="10. c = ((c + z) + 5)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 []\n' +
            'n5 -> n6 []\n' +
            'n6 -> n7 []\n' +
            'n7 -> n8 []\n' +
            'n8 -> n9 [label="T"]\n' +
            'n8 -> n11 [label="F"]\n' +
            'n9 -> n10 []\n' +
            'n11 -> n12 [label="T"]\n' +
            'n11 -> n13 [label="F"]\n' +
            'n12 -> n10 []\n' +
            'n13 -> n10 []'
        );
    });
    it ('',()=>{// 10
        assert.equal(
            getTextFinished('function foo(x, y, z,w,v,u,s,t){\n' +
                '    let a = x[0] + 1;\n' +
                '    let b = a + y;\n' +
                '   let c = 0;\n' +
                '   let f=-7;\n' +
                '   if (\'d\' == "d") {\n' +
                '    c = ((-7)+c)/ (5-(9*5));\n' +
                '   } else if (b > -7) {\n' +
                '      c = c + x[1] + 5;\n' +
                '     } else \n' +
                '        c = c + z + 5;\n' +
                '\n' +
                '    return c;\n' +
                '}','[1,2,true,false,\'d\',6.5],2,3,true,false,\'d\',"d",1.5'),
            'n1 [label="1. a = (x[0] + 1)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n2 [label="2. b = (a + y)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n3 [label="3. c = 0", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n4 [label="4. f = - (7)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n5 [label="5. \'d\' == \'d\'", shape=diamond, style = filled, fillcolor=green]\n' +
            'n6 [label="10. c = ((- (7) + c) / (5 - (9 * 5)))", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n7 [label="8. return c", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n8 [label="6. b > - (7)", shape=diamond, style = filled, fillcolor=white]\n' +
            'n9 [label="9. c = ((c + x[1]) + 5)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n10 [label="7. c = ((c + z) + 5)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 []\n' +
            'n5 -> n6 [label="T"]\n' +
            'n5 -> n8 [label="F"]\n' +
            'n6 -> n7 []\n' +
            'n8 -> n9 [label="T"]\n' +
            'n8 -> n10 [label="F"]\n' +
            'n9 -> n7 []\n' +
            'n10 -> n7 []'
        );
    });
    it ('',()=>{// 11
        assert.equal(
            getTextFinished('function foo(x, y, z,w,v,u,s,t){\n' +
                '    let a = x[0] + 1;\n' +
                '    let b = a + y;\n' +
                '   let c = 0;\n' +
                '   let f=-7;\n' +
                '   if (\'d\' == "d") {\n' +
                '    c = -7+5\n' +
                '   } else if (b > -7) {\n' +
                '      c = c + x[1] + 5;\n' +
                '     } else \n' +
                '        c = c + z + 5;\n' +
                '\n' +
                '    return c;\n' +
                '}','[1,2,true,false,\'d\',6.5],2,3,true,false,\'d\',"d",1.5'),
            'n1 [label="1. a = (x[0] + 1)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n2 [label="2. b = (a + y)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n3 [label="3. c = 0", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n4 [label="4. f = - (7)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n5 [label="5. \'d\' == \'d\'", shape=diamond, style = filled, fillcolor=green]\n' +
            'n6 [label="10. c = (- (7) + 5)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n7 [label="8. return c", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n8 [label="6. b > - (7)", shape=diamond, style = filled, fillcolor=white]\n' +
            'n9 [label="9. c = ((c + x[1]) + 5)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n10 [label="7. c = ((c + z) + 5)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 []\n' +
            'n5 -> n6 [label="T"]\n' +
            'n5 -> n8 [label="F"]\n' +
            'n6 -> n7 []\n' +
            'n8 -> n9 [label="T"]\n' +
            'n8 -> n10 [label="F"]\n' +
            'n9 -> n7 []\n' +
            'n10 -> n7 []'
        );
    });
    it ('',()=>{// 12
        assert.equal(
            getTextFinished('function foo(x, y,z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '   let c = 0;\n' +
                '\n' +
                '    if (b < 3) \n' +
                '        c = c + 5;\n' +
                '     else if (b < 3 * 2) \n' +
                '        c = c + x + 5;\n' +
                '     else \n' +
                '        c = c + 3 + 5;\n' +
                '\n' +
                '     if(z==\'d\')\n' +
                '      c=c+1;\n' +
                '        \n' +
                '      while(1>5)\n' +
                '      c=1+2;\n' +
                '    \n' +
                '    return c;\n' +
                '}','1,2,"d"'),
            'n1 [label="1. a = (x + 1)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n2 [label="2. b = (a + y)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n3 [label="3. c = 0", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n4 [label="4. b < 3", shape=diamond, style = filled, fillcolor=green]\n' +
            'n5 [label="13. c = (c + 5)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n6 [label="7. z == \'d\'", shape=diamond, style = filled, fillcolor=green]\n' +
            'n7 [label="11. c = (c + 1)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n8 [label="8. 1 > 5", shape=diamond, style = filled, fillcolor=green]\n' +
            'n9 [label="10. c = (1 + 2)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n10 [label="9. return c", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n11 [label="5. b < (3 * 2)", shape=diamond, style = filled, fillcolor=green]\n' +
            'n12 [label="12. c = ((c + x) + 5)", shape=rectangle, style = filled, fillcolor=green]\n' +
            'n13 [label="6. c = ((c + 3) + 5)", shape=rectangle, style = filled, fillcolor=white]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 [label="T"]\n' +
            'n4 -> n11 [label="F"]\n' +
            'n5 -> n6 []\n' +
            'n6 -> n7 [label="T"]\n' +
            'n6 -> n8 [label="F"]\n' +
            'n7 -> n8 []\n' +
            'n8 -> n9 [label="T"]\n' +
            'n8 -> n10 [label="F"]\n' +
            'n9 -> n8 []\n' +
            'n11 -> n12 [label="T"]\n' +
            'n11 -> n13 [label="F"]\n' +
            'n12 -> n6 []\n' +
            'n13 -> n6 []'
        );
    });
});
