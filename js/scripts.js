/**
 * swatchSelector v. 1.1
 *
 * Copyright 2014, Nick Fogle
 * http://nickfogle.com
 */
;( function( window ) {

	'use strict';

	/* from https://github.com/inuyaksa/jquery.nicescroll/blob/master/jquery.nicescroll.js */
	function hasParent( e, p ) {
		if (!e) return false;
		var el = e.target||e.srcElement||e||false;
		while (el && el != p) {
			el = el.parentNode||false;
		}
		return (el!==false);
	};

	/* extend obj function */
	function extend( a, b ) {
		for( var key in b ) {
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	/* SwatchSelector function */
	function SwatchSelector( el, options ) {
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );
		this._init();
	}
	/* initialize functions and variables and cache vars */
	SwatchSelector.prototype._init = function() {

		// check if native select box is using a placeholder
		var selectedOpt = this.el.querySelector( 'option[selected]' );

		// the placeholder is disabled and selected by default
		this.hasDefaultPlaceholder = selectedOpt && selectedOpt.disabled;

		// get selected option (either the first option with attr selected or just the first option)
		this.selectedOpt = selectedOpt || this.el.querySelector( 'option' );

		// create structure
		this._createSelectEl();

		// all options
		this.selOpts = [].slice.call( this.selEl.querySelectorAll( 'li[data-option]' ) );

		// total options
		this.selOptsCount = this.selOpts.length;

		// current index
		this.current = this.selOpts.indexOf( this.selEl.querySelector( 'li.swatch-selected' ) ) || -1;

		// placeholder elem
		this.selPlaceholder = this.selEl.querySelector( 'span.swatch-placeholder' );

		// init events
		this._initEvents();
	}

	/* creates html structure for select element */
	SwatchSelector.prototype._createSelectEl = function() {
		var self = this, options = '', createOptionHTML = function(el) {
			var optclass = '', classes = '', link = '';

			if( el.selectedOpt && !this.foundSelected && !this.hasDefaultPlaceholder ) {
				classes += 'swatch-selected ';
				this.foundSelected = true;
			}
			// extra classes
			if( el.getAttribute( 'data-class' ) ) {
				classes += el.getAttribute( 'data-class' );
			}
			// link options
			if( el.getAttribute( 'data-link' ) ) {
				link = 'data-link=' + el.getAttribute( 'data-link' );
			}

			if( classes !== '' ) {
				optclass = 'class="' + classes + '" ';
			}

			return '<li ' + optclass + link + ' data-option data-value="' + el.value + '"><span>' + el.textContent + '</span></li>';
		};

		[].slice.call( this.el.children ).forEach( function(el) {
			if( el.disabled ) { return; }

			var tag = el.tagName.toLowerCase();

			if( tag === 'option' ) {
				options += createOptionHTML(el);
			}
			else if( tag === 'optgroup' ) {
				options += '<li class="swatch-optgroup"><span>' + el.label + '</span><ul>';
				[].slice.call( el.children ).forEach( function(opt) {
					options += createOptionHTML(opt);
				} )
				options += '</ul></li>';
			}
		} );

		var opts_el = '<div class="swatch-options"><ul>' + options + '</ul></div>';
		this.selEl = document.createElement( 'div' );
		this.selEl.className = this.el.className;
		this.selEl.tabIndex = this.el.tabIndex;
		this.selEl.innerHTML = '<span class="swatch-placeholder">' + this.selectedOpt.textContent + '</span>' + opts_el;
		this.el.parentNode.appendChild( this.selEl );
		this.selEl.appendChild( this.el );
	}

	/* initialize events */
	SwatchSelector.prototype._initEvents = function() {
		var self = this;

		// open/close select
		this.selPlaceholder.addEventListener( 'click', function() {
			self._toggleSelect();
		} );

		// clicking the options
		this.selOpts.forEach( function(opt, idx) {
			opt.addEventListener( 'click', function() {
				self.current = idx;
				self._changeOption();
				// close select elem
				self._toggleSelect();
			} );
		} );

		// close the select element if the target isn't the select element or its descendants..
		document.addEventListener( 'click', function(ev) {
			var target = ev.target;
			if( self._isOpen() && target !== self.selEl && !hasParent( target, self.selEl ) ) {
				self._toggleSelect();
			}
		} );
	}

	/* toggle select - when opened show the default placeholder if any */
	SwatchSelector.prototype._toggleSelect = function() {

		// remove focus class if any..
		this._removeFocus();

		if( this._isOpen() ) {
			if( this.current !== -1 ) {

				// update placeholder text
				this.selPlaceholder.textContent = this.selOpts[ this.current ].textContent;
			}
			classie.remove( this.selEl, 'swatch-active' );
		}
		else {
			if( this.hasDefaultPlaceholder && this.options.stickyPlaceholder ) {
				// if already selected, show checked swatch on modal open
				this.selPlaceholder.textContent = this.selectedOpt.textContent;
			}
			classie.add( this.selEl, 'swatch-active' );
		}
	}
	/* change option - the new value is set */
	SwatchSelector.prototype._changeOption = function() {
		// if pre selected current (if we navigate with the keyboard)...
		if( typeof this.preSelCurrent != 'undefined' && this.preSelCurrent !== -1 ) {
			this.current = this.preSelCurrent;
			this.preSelCurrent = -1;
		}

		// current option
		var opt = this.selOpts[ this.current ];

		// update current selected value
		this.selPlaceholder.textContent = opt.textContent;

		// change native select element´s value
		this.el.value = opt.getAttribute( 'data-value' );

		// remove class swatch-selected from old selected option and add it to current selected option
		var oldOpt = this.selEl.querySelector( 'li.swatch-selected' );
		if( oldOpt ) {
			classie.remove( oldOpt, 'swatch-selected' );
		}
		classie.add( opt, 'swatch-selected' );

		// if there´s a link defined
		if( opt.getAttribute( 'data-link' ) ) {
			// open in new tab?
			if( this.options.newTab ) {
				window.open( opt.getAttribute( 'data-link' ), '_blank' );
			}
			else {
				window.location = opt.getAttribute( 'data-link' );
			}
		}
		// callback
		this.options.onChange( this.el.value );
	}
	/* returns true if select element is opened */
	SwatchSelector.prototype._isOpen = function(opt) {
		return classie.has( this.selEl, 'swatch-active' );
	}

	/* removes the focus class from the option */
	SwatchSelector.prototype._removeFocus = function(opt) {
		var focusEl = this.selEl.querySelector( 'li.swatch-focus' )
		if( focusEl ) {
			classie.remove( focusEl, 'swatch-focus' );
		}
	}

	/* add to global namespace */
	window.SwatchSelector = SwatchSelector;

} )( window );
