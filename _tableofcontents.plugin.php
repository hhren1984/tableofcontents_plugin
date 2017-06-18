<?php

/**
 * This file implements the Table of content plugin.
 *
 * For the most recent and complete Plugin API documentation
 * see {@link Plugin} in ../inc/plugins/_plugin.class.php.
 *
 * This file is part of the evoCore framework - {@link http://evocore.net/}
 * See also {@link https://github.com/b2evolution/b2evolution}.
 *
 * @license GNU GPL v2 - {@link http://b2evolution.net/about/gnu-gpl-license}
 *
 * @copyright (c)2003-2016 by Francois Planque - {@link http://fplanque.com/}
 * Parts of this file are copyright (c)2004-2006 by Daniel HAHLER - {@link http://thequod.de/contact}.
 *
 * @package plugins
 */
if (!defined('EVO_MAIN_INIT'))
	die('Please, do not access this page directly.');

/**
 * Table of content Plugin
 *
 * This plugin responds to virtually all possible plugin events :P
 *
 * @package plugins
 */
class tableofcontents_plugin extends Plugin {

	/**
	 * Variables below MUST be overriden by plugin implementations,
	 * either in the subclass declaration or in the subclass constructor.
	 */
	var $name = 'Table of contents';
	var $code = 'evo_tableofcontent';
	var $group = 'rendering';
	var $short_desc;
	var $long_desc;
	var $priority = 99;
	var $number_of_installs = 1;
	var $version = '0.1';

	/**
	 * Init
	 *
	 * This gets called after a plugin has been registered/instantiated.
	 */
	function PluginInit(& $params) {
		$this->short_desc = T_('Table of post contents plugin');
		$this->long_desc = T_('This would make the table of the post contents automatically by the html tag h1 to h6.');
	}
	
		/**
	 * Define the GLOBAL settings of the plugin here. These can then be edited in the backoffice in System > Plugins.
	 *
	 * @see Plugin::GetDefaultSettings()
	 * @param array Associative array of parameters (since v1.9).
	 *    'for_editing': true, if the settings get queried for editing;
	 *                   false, if they get queried for instantiating {@link Plugin::$Settings}.
	 * @return array see {@link Plugin::GetDefaultSettings()}.
	 * The array to be returned should define the names of the settings as keys (max length is 30 chars)
	 * and assign an array with the following keys to them (only 'label' is required):
	 */
	function GetDefaultSettings( & $params )
	{
		$r = array(
			'list_style' => array(
				'label' => 'Select a list style',
				'defaultvalue' => 'order',
				'type' => 'select',
				'options' => array( 'order' => 'Order List', 'unordered' => 'Unordered list' ),
				'note' => 'This is the style of the content table list',
			)
		);
		return $r;
	}

	/**
	 * Define here default collection/blog settings that are to be made available in the backoffice.
	 *
	 * @param array Associative array of parameters.
	 * @return array See {@link Plugin::get_coll_setting_definitions()}.
	 */
	function get_coll_setting_definitions(& $params) {
		$default_params = array_merge($params, array(
		    'default_post_rendering' => 'opt-out',
		    'default_comment_rendering' => 'never'
		));
		return parent::get_coll_setting_definitions($default_params);
	}

	/**
	 * Event handler: Called at the beginning of the skin's HTML HEAD section.
	 *
	 * Use this to add any HTML HEAD lines (like CSS styles or links to resource files (CSS, JavaScript, ..)).
	 *
	 * @see Plugin::SkinBeginHtmlHead()
	 * @param array Associative array of parameters
	 */
	function SkinBeginHtmlHead(& $params) {
		$this->require_js('js/toc.js');
	}

	/**
	 * Event handler: Called when rendering item/post contents as HTML. (CACHED)
	 *
	 * The rendered content will be *cached* and the cached content will be reused on subsequent displays.
	 * Use {@link DisplayItemAsHtml()} instead if you want to do rendering at display time.
	 *
	 * Note: You have to change $params['data'] (which gets passed by reference).
	 *
	 * @see Plugin::DisplayItemAsHtml()
	 * @param array Associative array of parameters
	 *   - 'data': the data (by reference). You probably want to modify this.
	 *   - 'format': see {@link format_to_output()}. Only 'htmlbody' and 'entityencoded' will arrive here.
	 *   - 'Item': the {@link Item} object which gets rendered.
	 *   - 'view_type': What part of a post are we displaying: 'teaser', 'extension' or 'full'
	 * @return boolean Have we changed something?
	 */
	function RenderItemAsHtml(& $params) {
		global $Item;
		$page_url = is_object($Item) ? $Item->get_permanent_url() : '';
		$list_style = $this->Settings->get('list_style');
		$content_id = 'item_' . (isset($Item->ID) ? $Item->ID : '').' .evo_post__full_text';
		$script = '<script>$(document).ready(function() {new Toc({target: "h1",content: "#'.$content_id.'",depth: 6, page_url: "'.$page_url.'", list_style:"'.$list_style.'"});});</script>';
		$params['data'] .=  $script;

		return true;
	}

}


?>
