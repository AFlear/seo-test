# Заголовок 1 уровня

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto distinctio eos ex ipsum laudantium optio perferendis quasi quibusdam quisquam, totam? Ad alias, culpa facilis impedit ipsum molestiae optio placeat tempora? Lorem ipsum dolor sit amet, consectetur adipisicing elit.

## Заголовок 2 уровня

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto distinctio eos ex ipsum laudantium optio perferendis quasi quibusdam quisquam, totam? Ad alias, culpa facilis impedit ipsum molestiae optio placeat tempora? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto distinctio eos ex ipsum laudantium optio perferendis quasi quibusdam quisquam, totam?

### Заголовок 3 уровня

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto distinctio eos ex ipsum laudantium optio perferendis quasi quibusdam quisquam, totam? Ad alias, culpa facilis impedit ipsum molestiae optio placeat tempora? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto distinctio eos ex ipsum laudantium optio perferendis quasi quibusdam quisquam, totam? Ad alias, culpa facilis impedit ipsum molestiae optio placeat tempora? Lorem ipsum dolor sit amet, consectetur adipisicing elit.

#### Заголовок 4 уровня

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto distinctio eos ex ipsum laudantium optio perferendis quasi quibusdam quisquam, totam? Ad alias, culpa facilis impedit ipsum molestiae optio placeat tempora? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto distinctio eos ex ipsum laudantium optio perferendis quasi quibusdam quisquam, totam?

##### Заголовок 5 уровня

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto distinctio eos ex ipsum laudantium optio perferendis quasi quibusdam quisquam, totam? Ad alias, culpa facilis impedit ipsum molestiae optio placeat tempora? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto distinctio eos ex ipsum laudantium optio perferendis quasi quibusdam quisquam, totam? Ad alias, culpa facilis impedit ipsum molestiae optio placeat tempora?

###### Заголовок 6 уровня

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto distinctio eos ex ipsum laudantium optio perferendis quasi quibusdam quisquam, totam? Ad alias, culpa facilis impedit ipsum molestiae optio placeat tempora? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto distinctio eos ex ipsum laudantium optio perferendis quasi quibusdam quisquam, totam? Ad alias, culpa facilis impedit ipsum molestiae optio placeat tempora? Lorem ipsum dolor sit amet, consectetur adipisicing elit.

----

## Форматирование текста

Краткая демонстрация текстовых элементов.

#### Параграф

Элемент "параграф", который создаеться тегом `<p>...</p>` определяет текстовый абзац(создает новый параграф). Абзац является блочным элементом, всегда начинается с новой строки и имеет отсуп до и после себя. Абзац не позволяет вкладывать внутрь себя такие друшие блочные элементы, к примеру `<address>...</address>` (информации об авторе), `<blockquote>...</blockquote>` (блочная цитата), `<table>...</table>` (таблица), а также другие абзаци `<p> <p> ... </p>`

#### Перевод строки

Если вам нужно принудительно перевести строку текста на новую линию, 
без создания нового абзаца и верстикальных отступов между - используйте одинарный элемент `<br>`.



#### Ссылки

Чтобы превратить ваш текст в гиперссылку, нужно использовать [элемент &lt;a>](#),  
вместе с атрибутом `<a href="URL">...</a>` для указания адреса перехода  
или для указания якоря - `<a name="anchor">...</a>`

Вы можете отформатировать текст используя такие элементы, как `<i>...</i>` или `<em>...</em>` , *чтобы сделать ваш текст наклонным*.

Вы также можете использовать `<q>...</q>` - <q>строчные цитаты, которые в отличии от блочных, позволяют вложенность внутри абзаца</q>.

При помощи элементов `<b>...</b>` или `<strong>...</strong>` - можно **обозначить важный текст жирностью шрифта**.

Для <ins>подчеркивания текста</ins> используйте `<u>...</u>` или `<ins>...</ins>`,  a для ~~перечеркивания~~ - `<del>...</del>`.

Также можно <mark>выделить нужную часть текста</mark> при помощи элемента `<mark>...</mark>` .

Также можно использовать специальные элементы `<sup>...</sup>` <sup>Отображает шрифт в виде верхнего индекса</sup>  
и `<sub>...</sub>` <sub>Отображает шрифт в виде нижнего индекса.</sub>

Элемент `<small>...</small>` <small>уменьшает размер шрифта.</small>

Элемент `<code>...</code>` предназначен для отображения одной или нескольких строк текста, который представляет собой программный код  
<small>*Пример:*</small>  
Чтобы узнать контекст метода нужно вызвать `console.log(this);`.

Элемент <kbd>&lt;kbd></kbd> используется для обозначения текста, который набирается на клавиатуре или для названия клавиш  
<small>*Пример:*</small>  
Чтобы вызвать "Диспетчер задач" нажмите на клавиатуре вместе 3 клавиши - <kbd>Ctrl + Alt + Del</kbd>.

Элемент <samp>&lt;samp></samp> используется для отображения текста, который является результатом вывода компьютерной программы или скрипта  
<small>*Пример:*</small>  
<samp>К сожалению, Ваш браузер НЕ поддерживает современные возможности JavaScript!</samp>

Элемент `<abbr>...</abbr>` указывает, что <abbr title="последовательность символов">ПС</abbr> является аббревиатурой. С помощью атрибута дается расшифровка сокращения - `<abbr title="последовательность символов">ПС</abbr>`, что позволяет понимать аббревиатуру тем людям, которые с ней не знакомы.   
Кроме того, *поисковые системы индексируют полнотекстовый вариант сокращения*, что может использоваться для повышения рейтинга документа.

Как правило, когда, в документе, упоминается <dfn title="это новый термин">новый термин</dfn>, он выделяется курсивом и дается его определение. При использовании этого термина в дальнейшем, он считается уже известным читателю. Элемент `<dfn>` применяется для выделения тыдел терминов при их первом появлении в тексте. С помощью атрибута `title` вы можете дать более подробную расшифровку термина.  
<small>*Пример:*</small>  
`<dfn title="это новый термин">новый термин</dfn>`

#### Выделение блоков текста

> Элемент `<blockquote>...</blockquote>` используется для обозначения цитат, длинных выписок, афоризмов и прочее, который создается в новом блоке с пробелами до и после.

```markup
Тег <pre>...</pre> определяет блок предварительно форматированного текста.
	Такой текст отображается обычно моноширинным шрифтом
	и со всеми пробелами    между    словами.
		По умолчанию, любое количество пробелов идущих в коде подряд,
		на веб-странице показывается как один.

	Тег <pre> позволяет обойти эту особенность и отображать текст
		как
		требуется
		разработчику.
```

<address>Элемент `<address>...</address>` предназначен для хранения информации об авторе (НЕ адреса и контакты компании, прочее) и может включать в себя любые элементы HTML вроде ссылок, текста, выделений и т.д.</address>

----

## Списки

#### Маркированный список

Элемент `<ul>...</ul>` устанавливает маркированный (неупорядоченный) список. Каждый пункт списка должен начинаться с элемента `<li>...</li>`. Если к `<ul>` применяется таблица стилей, то элементы `<li>` наследуют эти свойства.

*Пример:*

```markup
<ul>
	<li>пункт маркированного списка</li>
	<li>пункт маркированного списка</li>
	<li>пункт маркированного списка
		<ul>
			<li>вложенный пункт маркированного списка</li>
			<li>вложенный пункт маркированного списка</li>
			<li>вложенный пункт маркированного списка
				<ol>
                    <li>вложенный пункт маркированного списка</li>
                    <li>вложенный пункт маркированного списка</li>
                    <li>вложенный пункт маркированного списка</li>
                </ol>
			</li>
		</ul>
	</li>
</ul>
```

*Результат:*

- пункт маркированного списка
- пункт маркированного списка
- пункт маркированного списка
	- вложенный пункт маркированного списка
	- вложенный пункт маркированного списка
	- вложенный пункт маркированного списка
		- вложенный пункт маркированного списка
		- вложенный пункт маркированного списка
		- вложенный пункт маркированного списка

#### Нумерованный список

Элемент `<ol>...</ol>` устанавливает нумерованный (упорядоченный) список. Каждый элемент списка должен начинаться с `<li>...</li>`. Если к `<ol>` применяется таблица стилей, то элементы `<li>` наследуют эти свойства.

*Пример:*

```markup
<ol>
	<li>пункт нумерованного списка</li>
	<li>пункт нумерованного списка</li>
	<li>пункт нумерованного списка
		<ol>
			<li>вложенный пункт нумерованного списка</li>
			<li>вложенный пункт нумерованного списка</li>
			<li>вложенный пункт нумерованного списка
				<ol>
                    <li>вложенный пункт нумерованного списка</li>
                    <li>вложенный пункт нумерованного списка</li>
                    <li>вложенный пункт нумерованного списка</li>
                </ol>
			</li>
		</ol>
	</li>
</ol>
```

*Результат:*

1. пункт нумерованного списка
1. пункт нумерованного списка
1. пункт нумерованного списка
	1. вложенный пункт нумерованного списка
	1. вложенный пункт нумерованного списка
	1. вложенный пункт нумерованного списка
		1. вложенный пункт нумерованного списка
		1. вложенный пункт нумерованного списка
		1. вложенный пункт нумерованного списка


#### Список определений

Элемент `<dl>...</dl>` входит в тройку элементов `<dl>`, `<dt>`, `<dd>`, предназначенных для создания списка описаний. Каждый такой список начинается с контейнера `<dl>`, куда входит элемент `<dt>` создающий термин и элемент `<dd>` задающий описание этого термина.

*Пример:*

```markup
<dl>
	<dt>Что такое Тег?</dt>
	<dd>Тег — это специальный символ разметки, который применяется для вставки различных элементов на веб-страницу таких как: рисунки, таблицы, ссылки и др., и для изменения их вида.</dd>
	
	<dt>Что такое HTML-документ?</dt>
	<dd>Обычный текстовый файл, который может содержать в себе текст, теги и стили. Изображения и другие объекты хранятся отдельно. Содержимое такого файла обычно называется HTML-код.</dd>
	
	<dt>Что такое Сайт?</dt>
	<dd>Cайт — это набор отдельных веб-страниц, которые связаны между собой ссылками и единым оформлением.</dd>
</dl>
```

*Результат:*

<dl><dt>Что такое Тег?</dt><dd>Тег — это специальный символ разметки, который применяется для вставки различных элементов на веб-страницу таких как: рисунки, таблицы, ссылки и др., и для изменения их вида.</dd><dt>Что такое HTML-документ?</dt><dd>Обычный текстовый файл, который может содержать в себе текст, теги и стили. Изображения и другие объекты хранятся отдельно. Содержимое такого файла обычно называется HTML-код.</dd><dt>Что такое Сайт?</dt><dd>Cайт — это набор отдельных веб-страниц, которые связаны между собой ссылками и единым оформлением.</dd></dl>

----


## Таблицы

Table heading | Table heading | Table heading
--- | --- | ---
Lorem ipsum dolor sit amet. | Alias amet beatae blanditiis. | Lorem ipsum dolor sit amet.
Alias amet beatae blanditiis. | Lorem ipsum dolor sit amet. | Alias amet beatae blanditiis.

Table heading | Table heading | Table heading | Table heading | Table heading 
--- | --- | --- | --- | --- 
Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. | Alias amet beatae blanditiis consectetur. | Lorem ipsum dolor sit amet, consectetur adipisicing elit. | Alias amet beatae blanditiis consectetur. | Lorem ipsum dolor sit amet, consectetur adipisicing elit.
Alias amet beatae blanditiis consectetur. | Lorem ipsum dolor sit amet, consectetur adipisicing elit. | Alias amet beatae blanditiis consectetur. | Lorem ipsum dolor sit amet, consectetur adipisicing elit. | Alias amet beatae blanditiis consectetur. Alias amet beatae blanditiis consectetur.
Lorem ipsum dolor sit amet, consectetur adipisicing elit. | Alias amet beatae blanditiis consectetur. | Lorem ipsum dolor sit amet, consectetur adipisicing elit. | Alias amet beatae blanditiis consectetur. | Lorem ipsum dolor sit amet, consectetur adipisicing elit.
Alias amet beatae blanditiis consectetur. | Lorem ipsum dolor sit amet, consectetur adipisicing elit. | Alias amet beatae blanditiis consectetur. Alias amet beatae blanditiis consectetur. | Lorem ipsum dolor sit amet, consectetur adipisicing elit. | Alias amet beatae blanditiis consectetur.


---

# Media

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto distinctio eos ex ipsum laudantium optio perferendis quasi quibusdam quisquam, totam? Ad alias, culpa facilis impedit ipsum molestiae optio placeat tempora? Lorem ipsum dolor sit amet, consectetur adipisicing elit.

<iframe width="1280" height="720" src="https://www.youtube.com/embed/LEzKfmzKmjA" allowfullscreen></iframe>

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto distinctio eos ex ipsum laudantium optio perferendis quasi quibusdam quisquam, totam? Ad alias, culpa facilis impedit ipsum molestiae optio placeat tempora? Lorem ipsum dolor sit amet, consectetur adipisicing elit.

<video controls src="/Media/assets/files/video.mp4" width="1280" height="720"></video>

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto distinctio eos ex ipsum laudantium optio perferendis quasi quibusdam quisquam, totam? Ad alias, culpa facilis impedit ipsum molestiae optio placeat tempora? Lorem ipsum dolor sit amet, consectetur adipisicing elit.

<audio controls src="/Media/assets/files/audio.mp3"></audio>


---
