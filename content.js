console.log('Hello from the extension!');

const iframe = $('iframe');


const sectionIds = [];
let sectionIdCount = 0;


//let customCssStart = $('#customCSSEditor .ace_content .ace_text-layer');
//console.log(customCssStart.html());


iframe.each(function() {
    let frame = $(this);
    console.log(frame);
    let id = frame.attr('id'); 
    if (id != null && id.charAt(0) == '_') {
        sectionIds[sectionIdCount++] = id;
    }

    frame.on('load', function() {
        console.log('Frame loaded!');
        let frameContent = frame.contents();
        let backgroundChanger = frameContent.find('#page .content .background_changer');
        console.log(backgroundChanger);
    });
});

let customCss = {};
let clickStatus = {};

const sections = $('.screen .frameWrapper ul li');
sections.each(function(index) {
    const section = $(this);
    const style = "cursor:pointer;" + 
                  "z-index:99;" + 
                  "position:absolute;" +
                  "left:0;" + 
                  "top:0;" +
                  "width:35px !important;" +
                  "height:35px !important;";
    const id = makeid(5);
    const div =     `<div class="dak_extension_gear_button" style="width:35px;height:35px;background:rgb(243,106,106);"></div>
                    <div class="dak_extension_nav" style="display:none;position:absolute;left:35px;top:0;">
                        <div class="dak_extension_nav_wrapper" style="display:inline-block;background:rgb(51,51,51);color:white;">
                            <div class="dak_extension_position" style="display:flex;margin:20px;">
                                <div class="dak_extension_position_title" style="text-align:left;margin-right:20px;width:200px;display:inline-block;">Background Image Position</div>
                                <select class="dak_extension_position_select" style="width:90px;padding:3px 4px;border:1px solid #aaa;border-radius:2px;">
                                    <option hidden>Choose</option>
                                    <option class="dak_extension_position dak_extension_position_initial" value="initial">Initial</option>
                                    <option class="dak_extension_position dak_extension_position_top" value="top">Top</option>
                                    <option class="dak_extension_position dak_extension_position_bottom" value="bottom">Bottom</option>
                                    <option class="dak_extension_position dak_extension_position_center" value="center">Center</option>
                                </select>
                            </div>
                            <div class="dak_extension_size" style="display:flex;margin:20px;">
                                <div class="dak_extension_size_title" style="text-align:left;margin-right:20px;width:200px;display:inline-block;">Background Image Size</div>
                                <select class="dak_extension_size_select" style="width:90px;padding:3px 4px;border:1px solid #aaa;border-radius:2px;">
                                    <option hidden>Choose</option>
                                    <option class="dak_extension_size dak_extension_size_left" value="cover">Cover</option>
                                    <option class="dak_extension_size dak_extension_size_right" value="contain">Contain</option>
                                    <option class="dak_extension_size dak_extension_size_top" value="initial">Initial</option>
                                </select>
                            </div>
                        </div>
                        <div class="dak_extension_copy_box" style="margin-left:10px;width:25px;height:25px;background:rgb(51,51,51);color:white;">
                        </div>
                    </div>`;
    const styleScript =     `<style>
                                .dak_extension_main[style] {
                                    width: 50px !important;
                                    height:50px !important;
                                    user-select: none;
                                    outline: 0;
                                }
                            </style>`;
    
    section.html(styleScript + `<div id="${id}" class="dak_extension_main" style="${style}">${div}</div>` + section.html());
    clickStatus[id] = false;

    $('#' + id + ' .dak_extension_gear_button').click(function() {
        let nav = $('#' + id + ' .dak_extension_nav');
        if (!clickStatus[id]) {
            nav.css('display', 'flex');
            clickStatus[id] = true;
        } else {
            nav.css('display', 'none');
            clickStatus[id] = false;
        }
    });


    let backgroundChangerDiv = '#' + sectionIds[index] + ' .background_changer';
    customCss[backgroundChangerDiv] = {};

    $('#' + id + ' .dak_extension_position_select').change(function() {
        let value = $(this).val();
        customCss[backgroundChangerDiv]['background-position'] = value;
    });

    $('#' + id + ' .dak_extension_size_select').change(function() {
        let value = $(this).val();
        customCss[backgroundChangerDiv]['background-size'] = value;
    });

    $('#' + id + ' .dak_extension_nav .dak_extension_copy_box').click(function() {
        navigator.clipboard.writeText(generateCss(customCss)).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    });
});


$(document).ready(function() {
    const btnAction = $('.navbar-right .js_page_action_wrapper');
    btnAction.css('display', 'block');
    const btnLoading = $('.navbar-right .w_loader');
    btnLoading.css('display', 'none');
}); 


function generateCss(customCss) {
    let customCssText = '', css='';
    for (let cssSelector in customCss) {
        for (let property in customCss[cssSelector]) {
            css = css + property + ':' + customCss[cssSelector][property] + ';';
        }
        if (css != '') {
            customCssText = customCssText  + cssSelector + '{' + css + '}';
            css = '';
        }
    }
    return '/* Extension code start */\n' + customCssText + '\n/* Extension code end */';
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}