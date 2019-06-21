fountain
===========

fountain is a JavaScript based parser for the screenplay format [Fountain](http://fountain.io/).


# Syntax Support

The full Fountain syntax is supported.

Currently fountain supports a limited range of key-value pairs for title pages - 

* Title, Credit, Author/s, Source, Notes, Draft date, Date, Contact, Copyright

Instructions
============

fountain accepts a string value to it's parse function, therefore opening or retrieving files is down to you - open the file, retrieve it's string contents and pass it to fountain. 


```

  fountain.parse(string, function (output) {
    // do something
  });

```

If you want access to the tokens that fountain generates, simply attach a true parameter to your parse calls. 

```

  fountain.parse(string, true, function (output) {
    // output.title - 'Big Fish'
    // output.html.title_page - '<h1>Big Fish</h1><p class="author">...'
    // output.html.script - '<h2><span class="bold">FADE IN:</span></h2>...'
    // output.tokens - [ ... { type: 'transition'. text: '<span class="bold">FADE IN:</span>' } ... ]
  });

```

The tokens would look as follows (just a small sample):

```
[ 
  ..., 
  { type="scene_heading", text="EXT. BRICK'S PATIO - DAY", scene_number="1"}, 
  { type="action", text="A gorgeous day. The su...emplating -- something."}, 
  { type="action", text="The SCREEN DOOR slides ...es with two cold beers."},  
  { type="dialogue_begin"}, 
  { type="character", text="STEEL"}, 
  { type="dialogue", text="Beer's ready!"}, 
  { type="dialogue_end"}, 
  { type="dialogue_begin"}, 
  { type="character", text="BRICK"}, 
  { type="dialogue", text="Are they cold?"}, 
  { type="dialogue_end"}, 
  { type="page_break"}, 
  { type="dialogue_begin"}, 
  { type="character", text="STEEL"}, 
  { type="dialogue", text="Does a bear crap in the woods?"}, 
  { type="dialogue_end"}, 
  { type="action", text="Steel sits. They laugh at the dumb joke."},
  { type="dialogue_begin"}, 
  { type="character", text="STEEL"}, 
  { type="parenthetical", text="(beer raised)"}, 
  { type="dialogue", text="To retirement."}, 
  { type="dialogue_end"}, 
  { type="dialogue_begin"}, 
  { type="character", text="BRICK"}, 
  { type="dialogue", text="To retirement."}, 
  { type="dialogue_end"}
  ...
```

As you can see fountain attaches some extra tokens, such as 'dialogue_begin' and 'dialogue_end'. These are used to block together sections, in the case of dialogue it allows fountain to attach a dual dialogue property to blocks of dialogue.


Credit
============
Credit for the creation of this parser goes to [Matt Daly](https://github.com/mattdaly/).