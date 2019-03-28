<?php
    // namespace Plugins\I18n;
    /**
     * Internationalization (i18n) class. Provides language loading and translation
     * methods without dependencies on [gettext](http://php.net/gettext).
     *
     * Typically this class would never be used directly, but used via the __()
     * function, which loads the message and replaces parameters:
     *
     *     // Display a translated message
     *     echo __('Hello, world');
     *
     *     // With parameter replacement
     *     echo __('Hello, :user', array(':user' => $username));
     */
    class I18n {

        /**
         * @var  string   target language: en, es, zh, etc
         */
        public static $lang = 'ru';

        /**
         * @var  string   default language on the site
         */
        public static $default_lang = 'ru';

        /**
         * @var  string  source language: en, es, zh, etc
         */
        public static $source = 'ru';

        /**
         * @var  array  cache of loaded languages
         */
        protected static $_cache = array();

        /**
         * Get and set the target language.
         *
         *     // Get the current language
         *     $lang = I18n::lang();
         *
         *     // Change the current language to Spanish
         *     I18n::lang('es');
         *
         * @param   string  $lang   new language setting
         * @return  string
         * @since   3.0.2
         */
        public static function lang($lang = NULL)
        {
            if ($lang)
            {
                // Normalize the language
                I18n::$lang = strtolower(str_replace(array(' ', '_'), '-', $lang));
            }

            return I18n::$lang;
        }


        public static function default_lang($lang) {
            return I18n::$default_lang = $lang;
        }


        /**
         * Returns translation of a string. If no translation exists, the original
         * string will be returned. No parameters are replaced.
         *
         *     $hello = I18n::get('Hello friends, my name is :name');
         *
         * @param   string  $string text to translate
         * @param   string  $lang   target language
         * @return  string
         */
        public static function get($string, $lang = NULL)
        {
            if ( ! $lang)
            {
                // Use the global target language
                $lang = I18n::$lang;
            }

            // Load the translation table for this language
            $table = I18n::load($lang);

            // Return the translated string if it exists
            return isset($table[$string]) ? $table[$string] : $string;
        }

        /**
         * Returns the translation table for a given language.
         *
         *     // Get all defined Spanish messages
         *     $messages = I18n::load('es');
         *
         * @param   string  $lang   language to load
         * @return  array
         */
        public static function load($lang)
        {
            if (isset(I18n::$_cache[$lang]))
            {
                return I18n::$_cache[$lang];
            }

            $table = array();
            $path = str_replace('hidden/hidden', 'hidden', getcwd() . '/hidden/i18n/');

			// Create a path for this set of parts
			$files = scandir($path . $lang);
			foreach($files AS $file) {
				if($file != '..' && $file != '.') {
					$table += require_once $path . $lang . '/' . $file;
				}
			}

            // Cache the translation table locally
            return I18n::$_cache[$lang] = $table;
        }

    }

    if ( ! function_exists('__'))
    {
        /**
         * Translation/internationalization function. The PHP function
         * [strtr](http://php.net/strtr) is used for replacing parameters.
         *
         *    __('Welcome back, :user', array(':user' => $username));
         *
         * [!!] The target language is defined by [I18n::$lang].
         *
         * @uses    I18n::get
         * @param   string  $string text to translate
         * @param   array   $values values to replace in the translated text
         * @param   string  $lang   source language
         * @return  string
         */
        function __($string, array $values = NULL, $lang = NULL)
        {
            $string = I18n::get($string, $lang);
            return empty($values) ? $string : strtr($string, $values);
        }
    }
