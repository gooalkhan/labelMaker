

var testJson = {
    "제품명": '커피로드 카페봉봉',
    "식품유형": '커피',
    "업소명": '(주)동원F&B 수원공장',
    "소재지": '경기도 수원시 장안로 천천로 210번길 21-15',
    "제조사명": '',
    "유통기한": '용기하단 표시일까지',
    "내용량": '300ml(205kcal)',
    "원재료명": '정제수, 원유30%(국산), 프렌치프레소 커피추출액5% (고형분함량1.0% 이상, 원두: 브라질산), 백설탕, 에스프레소 커피추출액2.7% (고형분함량 33.8% 이상, 원두:브라질산), 스위티스-디에스500, 유크림, 탈지분유 [외국산(국가명은 홈페이지에 별도 표시)], 가당연유1%, 탄산수소나트륨, 정제소금, 유화제, CMC, 합성향료(커피향, 밀크향)',
    "알레르기": '우유 함유',
    "내포장재질": '폴리프로필렌',
    "품목보고번호": '1976026300450',
    "환불 및 교환": '구입처 및 대리점',
    "보관방법": '개봉 후에는 반드시 냉장보관하시고, 유통기한이내더라도 빠른 시일내에 드시기 바랍니다',
    "주의사항": '원료성분에 의한 부유물 혹은 침전이 생길 수 있으나 품질에는 이상이 없으므로 잘 흔들어 드세요',
    "주의사항1": '어린이, 임산부, 카페인 민감자는 섭취에 주의하여 주시기 바랍니다',
    "주의사항2": '본 제품은 전자레인지 또는 온장고에 넣지 마세요',
    "부정불량식품신고표시": '이 제품은 공정거래위원회 고시 소비자 분쟁해결 기준에 의거 교환 또는 보상을 받을 수 있습니다',
    "부정불량식품신고표시1": '부정, 불량식품 신고는 국번없이 1399',
    "기타알레르기": '이 제품은 알레르기 유발 성분(난류, 메밀, 땅콩, 대두, 밀, 복숭아, 토마토, 호두, 돼지고기, 쇠고기)을 사용한 제품과 같은 제조시설에서 제조하고 있습니다',
    "기타표시사항": '소비자상담실 080-589-3223 (수신자요금부담)',
    "기타표시사항1": '멸균제품, 멸균방법: 136도 이상에서 4초이상 멸균(질소충전)',
    "기타표시사항2": '빈용기는 모아서 재활용합시다',
    "기타표시사항3": 'www.denmarkmilk.net'
};

$(document).ready(function () {

    function append_field(key = '', value = '') {
        $("div.form").append(`<div class="field"><input type="text" class="key" value="${key}">\
        <input type="text" class="value" value="${value}"> 머릿말표시 <input type="checkbox" \
        class="isDisplayed"> <button class="up">↑</button> <button class="down">↓</button></div>`)
        $("button.up:last").click(up_click)
        $("button.down:last").click(down_click)
    }

    $("button[id=append]").click(append_field);

    function up_click() {
        if ($(this).parent().prev().length) {
            let temp = $(this).parent().clone(true)
            $(this).parent().prev().before(temp)
            $(this).parent().remove()
        }
    }

    $("button.up").click(up_click);

    function down_click() {
        if ($(this).parent().next().length) {
            let temp = $(this).parent().clone(true)
            $(this).parent().next().after(temp)
            $(this).parent().remove()
        }
    }

    $("button.down").click(down_click);


    $("button[id='test']").click(function () {
        Object.keys(testJson).forEach(function (key) {
            if ($(`.key[value="${key}"]`).length) {
                $(`.key[value="${key}"]`).next().val(`${testJson[key]}`);
            } else {
                append_field(key, testJson[key])
            };
            $("input[name='width']").val("70")
            $("input[name='height']").val("100")
        });
    });

    //get label data in JSON
    function label2arr() {
        let result = []
        result.push({ "key": "한글표시사항", "value": "<식품위생법에 의한 한글표시사항>", "hasHeader": false, "align": "center" })
        $(".key").each(function (index) {
            if ($(this).next().val() !== "") {
                result.push({ "key": $(this).val(), "value": $(this).next().val(), "hasHeader": $(this).parent().find("input.isDisplayed").is(":checked") })
            }
        });
        return result
    }

    $("button[id='run']").click(function () {
        console.log(all_letters(label2arr()))

        //mm to pixel
        let total_width = parseInt($("input[name='width']").val()) / 2.54 / 10 * 96;
        let total_height = parseInt($("input[name='height']").val()) / 2.54 / 10 * 96;
        let offset = 2 / 2.54 / 10 * 96;
        let recycle_width = 10 / 2.54 / 10 * 96;
        let recycle_height = 13 / 2.54 / 10 * 96;
        let recycle_size = recycle_height * recycle_width
        let label_size = (total_width - 2 * offset) * (total_height - 2 * offset) - recycle_size
        let height = total_height - 2 * offset
        let width = total_width - 2 * offset
        let label_arr = label2arr()

        //remove svg if exist
        $("svg").remove();

        //Raphael init
        //        var paper = Raphael(document.getElementById("canvas"), total_width, total_height);
        let paper = Raphael(document.getElementById("canvas"), 1000, 1000);

        //default setting
        let outline = paper.rect(0, 0, total_width, total_height);
        let label = paper.rect(offset, offset, width, height);
        let fontsize = get_font_size(paper, label_arr, label_size)
        console.log(`fontsize: ${fontsize}`)

        let fields = make_field(paper, offset, offset, label_arr, width, fontsize)

        let finals = line_filler(paper, offset, offset, fields, width)

        finals.forEach(e => {
            if (e[0][0][0].length < 3) {
                line_shortener(e, width)
            }
        })
        //        console.log(finals[finals.length-1][0][0][0].getBBox().x)
        //        if (finals[finals.length - 1][0][0][0].getBBox().x != offset) {
        //            finals[finals.length - 1].translate(0, -finals[finals.length - 1][0][0][0].getBBox().height)
        //        }


        // var hangul = word(paper, offset, offset, label_arr[0]["value"], 10)

        //var ingredient = headed_mul_word(paper, offset, 50, width, label_arr[7], fontsize)

    });

    function word(canvas, x, y, value, fontsize) {
        //            let result = {}
        let st = canvas.set()
        var text = canvas.text(x, y, value)
        text.attr({
            "text-anchor": "start",
            "font-size": fontsize,
            "font-family": "Nanum Barun Gothic"
        });
        text.data("data", "text")
        var text_outer = canvas.rect(x, y, text.getBBox().width + text.getBBox().height * 0.3, text.getBBox().height * 1.2)
        text_outer.data("data", "outer_box")
        text.attr({
            "y": text_outer.getBBox().y + text_outer.getBBox().height / 2,
            "x": text_outer.getBBox().x + (text_outer.getBBox().width - text.getBBox().width) / 2
        })
        //            result["text_id"] = text.id
        //            result["outer_id"] = text_outer.id
        st.push(text, text_outer)
        //            result["id"] = st.data("id")
        return st
    }

    function mul_word(canvas, start_x, start_y, nextline_x, label_width, strings, fontsize) {
        //        let result = canvas.set();
        let st = canvas.set();
        let word_arr = strings.split(" ");
        word_arr.forEach(function (elem) {
            let temp = word(canvas, start_x, start_y, elem, fontsize)
            temp[1].attr({ "stroke-opacity": 0 })
            st.push(temp);
        });

        let first_line = canvas.set()
        let string = st.splice(0, 1);
        first_line.push(string);
        //        result.push(first_line)

        while (first_line.getBBox().width < label_width + nextline_x - start_x) {
            let string = st.splice(0, 1)
            if ((first_line.getBBox().width + string.getBBox().width) * 0.80 <= label_width) {
                string.translate(first_line.getBBox().x + first_line.getBBox().width - start_x, first_line.getBBox().y - start_y)
                first_line.push(string)
            } else {
                st.splice(0, 0, string)
                break
            }
        }
        //            line_shortener(first_line, label_width + nextline_x - start_x)

        let part_result = line_filler(canvas, nextline_x, first_line.getBBox().y + first_line.getBBox().height, st, label_width)
        part_result.splice(0, 0, first_line)
        console.log(`part_result_length ${part_result.length}`)
        // while (part_result.length > 0) {
        //     result.push(part_result.splice(0, 1))
        // }

        return part_result
    }

    function headed_word(canvas, x, y, obj, fontsize) {
        //            let result = {}
        let st = canvas.set()
        let header = word(canvas, x, y, obj["key"], fontsize)
        header.attr({ "font-weight": "bold" })
        header.data("data", "header")
        let content = word(canvas, header.getBBox().x + header.getBBox().width, header.getBBox().y, obj["value"], fontsize)
        content.data("data", "content")
        //            let content = word(canvas, canvas.getById(header["outer_id"]).getBBox().x + canvas.getById(header["outer_id"]).getBBox().width, canvas.getById(header["outer_id"]).getBBox().y, obj["value"], fontsize)
        //            result["header"] = header
        //            result["content"] = content
        //            st.push(canvas.getById(header["id"]), canvas.getById(content["id"]));
        st.push(header, content);
        st.data("data", obj["key"])
        //            result["id"] = st.id
        return st
    }

    function headed_mul_word(canvas, x, y, label_width, obj, fontsize) {
        let header = word(canvas, x, y, obj["key"], fontsize)
        header.attr({ "font-weight": "bold" })
        let temp = canvas.set()
        //콘테이너 일관성 유지위해 한번더 세트에 넣기
        temp.push(header)
        let content = mul_word(canvas, header.getBBox().x + header.getBBox().width, header.getBBox().y, x, label_width, obj["value"], fontsize);
        line_shortener(content[0], label_width + x - header.getBBox().x - header.getBBox().width)
        for (let i = 1; i < content.length; i++) {
            line_shortener(content[i], label_width)
        }
        //        console.log(header)
        //        content.splice(0, 0, header);
        let outer_box = canvas.rect(x, y, label_width, content.getBBox().height)
        header.push(outer_box)
        content[0].splice(0, 0, temp);
        //        content.forEach(e => {
        //            line_shortener(e, label_width)
        //        })
        console.log(content)
        return content
    }

    function line_filler(canvas, x, y, words_set, label_width) {
        let result = canvas.set();
        let first_line = canvas.set();
        let first_word = words_set.splice(0, 1)
        first_word.translate(x - first_word.getBBox().x, y - first_word.getBBox().y)
        first_line.push(first_word)
        result.push(first_line);
        //        console.log(result)
        while (words_set.length > 0) {
            let word = words_set.splice(0, 1)
            if ((result[result.length - 1].getBBox().width + word.getBBox().width) * 0.85 <= label_width && result[result.length - 1][0][0].length < 3 && Math.floor(result[result.length - 1].getBBox().width) != Math.floor(label_width)) {
                // if ((result[result.length - 1].getBBox().width + word.getBBox().width) * 0.8 <= label_width) {
                word.translate(result[result.length - 1].getBBox().x + result[result.length - 1].getBBox().width - word.getBBox().x, result[result.length - 1].getBBox().y - word.getBBox().y)
                result[result.length - 1].push(word)
            } else {
                let temp_line = canvas.set()
                word.translate(x - word.getBBox().x, result[result.length - 1].getBBox().y + result[result.length - 1].getBBox().height - word.getBBox().y)
                temp_line.push(word)
                result.push(temp_line)
                //                console.log(temp_line)
            }
        }
        //        console.log(`line_filled length: ${result.length}`)
        //        console.log(result)
        return result
    }

    function line_shortener(line, label_width) {
        const ori_x = line.getBBox().x
        const ori_y = line.getBBox().y
        const scale_ratio = label_width / line.getBBox().width
        //        console.log(`scale_ratio: ${scale_ratio}`)
        //        console.log(`line_length: ${line.length}`)
        if (scale_ratio < 1) {
            line.forEach(function (elem) {
                elem.scale(scale_ratio, 1, elem.getBBox().x, elem.getBBox().y)
            })
            //            line[0].translate(ori_x - line[0].getBBox().x, ori_y - line[0].getBBox().y)
            line[0].translate((ori_x - line[0].getBBox().x) / scale_ratio, ori_y - line[0].getBBox().y)
            if (line.length > 1) {
                for (let i = 1; i < line.length; i++) {
                    // console.log(`translating word No.:${i}`)
                    // console.log(`prev.x: ${line[i - 1].getBBox().x + line[i - 1].getBBox().width}`)
                    // console.log(`current.x: ${line[i].getBBox().x}`)
                    // console.log(`dx: ${line[i - 1].getBBox().x + line[i - 1].getBBox().width - line[i].getBBox().x}`)
                    line[i].translate((line[i - 1].getBBox().x + line[i - 1].getBBox().width - line[i].getBBox().x) / scale_ratio, line[i - 1].getBBox().y - line[i].getBBox().y)
                    // console.log(`after_current.x: ${line[i].getBBox().x}`)
                }
            }
        }
        else {
            // console.log(line)
            // console.log(line[line.length - 1])
            // console.log(line[line.length - 1][0][1])
            try {
                line[line.length - 1][0][1][1].attr({ "width": label_width + ori_x - line[line.length - 1][0][1][1].getBBox().x })
            } catch (err) {
                console.log(err)
            }
            // if (line[line.length - 1][0][1][1].length) {
            //     line[line.length - 1][0][1][1].attr({ "width": label_width + ori_x - line[line.length - 1][0][1][1].getBBox().x })
            // }
        }
    }

    function removeDups(str) {
        let uniqueLetters = [];
        let nonUniqueLetters = [];
        str.split('').filter(function (letter) {
            if (uniqueLetters.indexOf(letter) == -1) {
                uniqueLetters.push(letter);
            } else {
                nonUniqueLetters.push(letter);
            }
        });

        let result = uniqueLetters.filter(function (ltr) {
            if (nonUniqueLetters.indexOf(ltr) == -1) {
                return ltr;
            }
        });

        return result;
    }

    function all_letters(arr) {
        var result = []
        for (i = 0; i < arr.length; i++) {
            if (arr[i]["hasHeader"] == true) {
                result.push(arr[i]["key"])
                result.push(arr[i]["value"])
            } else {
                result.push(arr[i]["value"])

            }

        }
        return result.join(" ")
    }

    function get_font_size(canvas, obj, label_size) {
        let total_letter = all_letters(obj);
        let square = word(canvas, 0, 0, total_letter, 10);
        let fontsize = 10;
        let trys = 0
        while (square.getBBox().width * square.getBBox().height > label_size || square.getBBox().width * square.getBBox().height < label_size * 0.85) {
            if (square.getBBox().width * square.getBBox().height > label_size) {
                square.remove()
                fontsize -= 1
                square = word(canvas, 0, 0, total_letter, fontsize)
            }
            else if (square.getBBox().width * square.getBBox().height < square.getBBox().height < label_size * 0.85) {
                square.remove()
                fontsize += 1
                square = word(canvas, 0, 0, total_letter, fontsize)
            } else if (trys == 50) {
                break
            }
            trys++
            // console.log(`font-size: ${fontsize}`)
            // console.log(`label size:${label_size}`)
            // console.log(`square size: ${square.getBBox().width * square.getBBox().height}`)
            // console.log(`df:${(square.getBBox().width * square.getBBox().height - label_size) / label_size}`)
        }
        square.remove()
        return fontsize;
    }

    function make_field(canvas, x, y, arr, label_width, fontsize) {
        let result = canvas.set()
        let non_important = []
        while (arr.length) {
            let obj = arr.splice(0, 1)[0]
            //            console.log(obj)
            if (obj["hasHeader"] == true) {
                let field = headed_word(canvas, x, y, obj, fontsize)
                if (field.getBBox().width * 0.75 <= label_width) {
                    result.push(field)
                } else if (field.getBBox().width * 0.75 > label_width) {
                    field.remove()
                    field = headed_mul_word(canvas, x, y, label_width, obj, fontsize)
                    result.push(field)
                }
            } else if (obj["align"] == "center") {
                let field = word(canvas, x, y, obj["value"], fontsize)
                field[1].attr({ "width": label_width })
                field[0].attr({ "text-anchor": "middle" })
                field[0].attr({ "x": label_width / 2 + x })
                result.push(field)
            } else if (obj["align"] != "center" && obj["hasHeader"] == false) {
                non_important.push(obj["value"])
            }
        }
        //        let others = mul_word(canvas, result[result.length - 1].getBBox().x + result[result.length - 1].getBBox().width, y, x, label_width, non_important.join(" *"), fontsize)
        let others = mul_word(canvas, x, y, x, label_width, non_important.join(" *"), fontsize-1)
        result.push(others)
        // for (let i = 0; i < result.length; i++) {
        //     if (i == 0) {
        //         continue
        //     } else {
        //         result[i].translate(0, result[i - 1].getBBox().y + result[i - 1].getBBox().height - y)
        //     }
        // }
        others.forEach(e => { line_shortener(e, label_width) })
        //        line_shortener(others[0], label_width - result[result.length - 2].getBBox().width)
        //        console.log(result)
        return result
    }

});