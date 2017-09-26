/*
 * This basic js comes from https://github.com/PebbleRoad/auto-table-of-contents author:rmdort
 * Edited by haharen for b2evolution.
 */
(function (window) {

    'use strict'

    /**
     * Shims
     */

    function getTextContent(elem) {
        if ((elem.textContent) && (typeof (elem.textContent) != "undefined")) {
            return elem.textContent;
        } else {
            return elem.innerText;
        }
    }

    /*
     Options
     */

    var defaultOptions = {
        content: 'body',
        start: 'h2',
        depth: 6,
        klass: 'list--toc',
        appendTo: ''
    };


    /**
     * Constructor
     */

    function Toc(options) {

        this.options = this.extend({}, defaultOptions, options);

        this.obj = document.querySelector(this.options.content);

        this.options.start = this.options.start.substr(1);

        this.traverse();
    }

    function get_list_tag(list_style) {
        var value = Array();
        if (list_style == "order") {
            value[0] = "<ol>";
            value[1] = "</ol>";
        } else {
            value[0] = "<ul>";
            value[1] = "</ul>";
        }
        return value;
    }

    /**
     * Traverse
     */

    Toc.prototype.traverse = function () {

        var html = '',
                tagNumber = 0,
                txt = '',
                id = '',
                page_url = this.options.page_url,
                list_style = this.options.list_style,
                previous = this.options.start - 1,
                start = this.options.start,
                depth = this.options.depth,
                i = 0,
                srcTags = 'h' + this.options.start,
                element = '';

        var arr_list_tag = get_list_tag(list_style);

        while (depth > 1) {
            start++;
            srcTags = srcTags + ", h" + start,
                    depth--;
        }


        var found = this.obj.querySelectorAll(srcTags);
        if (found.length >= 1) {
            html += '<div style="clear:both"></div>';
            html += '<div style="border:solid 1px #ccc; background:#eee; float:left; min-width:200px;padding:4px 10px;">';
            html += '<p style="text-align:right;margin:0;"><span style="float:left;">Table of Contents<a title="System would build the table of the content by the html tag h1 to h6">(?)</a></span><a href="#" onclick="javascript:return openExpand(this);" title="Expand">[+]</a></p>';
            html += '<div style="display:none;line-height:160%;">';
        }
        for (var j = 0; j < found.length; j++) {

            element = found[j];

            /* Get the tag number of the element - 2, 3, 4, 5, 6 */
            tagNumber = element.tagName.substr(1);

            /* Text of the element */

            txt = getTextContent(element);
            var tit = txt.replace(/^\d+[.、\s]+/g, '');
            //tit = txt.replace(/[^a-zA-Z0-9_\-\s\u4e00-\u9fa5]+/g, '');

            /* Get and Set ID Attribute */
            id = element.getAttribute('id') || tit;

            //element.setAttribute("id", id);
            $(element).before('<a name="' + id + '" style="position: relative;" class="anchor"><span style="position: absolute;display:block; width:100px; height:50px;  top: -30px;  "></span></a>');
            $(element).append('<span style="position: absolute;display:block; width:100px; height:50px;  top: -30px;  "></span>');
            $("#" + id).css("position", "relative");

            /* Build UL */
            if (tit != null && tit.replace(/(^\s*)|(\s*$)/g, "") != "" && tit.length < 100) {
                switch (true) {
                    case (tagNumber > previous):
                        html += arr_list_tag[0] + "<li class=\"toc-" + id + "\"><a href=\"" + page_url + "#" + id + "\">" + tit + "</a>";
                        previous = tagNumber;
                        break;

                    case (tagNumber == previous):
                        html += "</li><li class=\"toc-" + id + "\"><a href=\"" + page_url + "#" + id + "\">" + tit + "</a>";
                        break;

                    case (tagNumber < previous):
                        while (tagNumber != previous) {
                            html += arr_list_tag[1] + "</li>";
                            previous--;
                        }
                        html += "<li class=\"toc-" + id + "\"><a href=\"" + page_url + "#" + id + "\">" + tit + "</a>";
                        break;
                }

            }
        }


        /* corrects our last item, because it may have some opened ul's */
        if (tagNumber > this.options.start) {
            while (tagNumber != this.options.start) {
                html += arr_list_tag[1];
                tagNumber--;
            }
        }
        if (found.length >= 1) {
            html += '</div></div>';
            html += '<div style="clear:both;margin-bottom:15px"></div>';
        }

        var fhtml = document.createElement('div');
        fhtml.className = this.options.klass;
        fhtml.innerHTML = html;

        if (this.options.appendTo) {
            var appendto = document.querySelector(this.options.appendTo)

            appendto.insertBefore(fhtml, appendto.firstChild);

        } else {
            this.obj.insertBefore(fhtml, this.obj.firstChild);
        }

    };


    /**
     * Shims
     */

    function getTextContent(elem) {
        if ((elem.textContent) && (typeof (elem.textContent) != "undefined")) {
            return elem.textContent;
        } else {
            return elem.innerText;
        }
    }

    /*
     * Extend
     */

    Toc.prototype.extend = function () {
        if (arguments.length > 1) {
            var master = arguments[0];
            for (var i = 1, l = arguments.length; i < l; i++) {
                var object = arguments[i];
                for (var key in object) {
                    master[key] = object[key];
                }
            }
        }
        return master;
    };


    return window.Toc = Toc;

})(window, undefined)

function openExpand(e) {
    if (e.innerHTML == '[+]') {
        $(e).attr('title', 'Shrink').html('[-]').parent().next().show();
    } else {
        $(e).attr('title', 'Expand').html('[+]').parent().next().hide();
    }
    e.blur();
    return false;
}
