/*
 * Copyright (C) 2016  Ben Ockmore
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import {Button, Col, OverlayTrigger, Row, Tooltip} from 'react-bootstrap';
import {faPlus, faQuestionCircle} from '@fortawesome/free-solid-svg-icons';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import IdentifierRow from './identifier-row';
import PropTypes from 'prop-types';
import React from 'react';
import {addIdentifierRow} from './actions';
import {connect} from 'react-redux';


/**
 * Container component. The IdentifierEditor component contains a number of
 * IdentifierRow elements, and renders these inside a modal, which appears when
 * the show property of the component is set.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.identifiers - The list of identifiers to be rendered in
 *        the editor.
 * @param {Array} props.identifierTypes - The list of possible types for an
 *        identifier.
 * @param {Function} props.onAddIdentifier - A function to be called when the
 *        button to add an identifier is clicked.
 * @param {Function} props.addIdentifierVisible - A boolean value to determine
 *        if 'Add Identifier' button should be visible.
 * @returns {ReactElement} React element containing the rendered
 *          IdentifierEditor.
 */
const IdentifierEditor = ({
	identifiers,
	identifierTypes,
	addIdentifierVisible,
	onAddIdentifier
}) => {
	const helpText = `identity of the entity in other databases and services, such as ISBN, barcode, MusicBrainz ID, WikiData ID, OpenLibrary ID, etc.
	You can enter either the identifier only (Q2517049) or a full link (https://www.wikidata.org/wiki/Q2517049).`;

	const helpIconElement = (
		<OverlayTrigger
			delay={50}
			overlay={<Tooltip id="identifier-editor-tooltip">{helpText}</Tooltip>}
			placement="right"
		>
			<FontAwesomeIcon
				className="fa-sm"
				icon={faQuestionCircle}
			/>
		</OverlayTrigger>
	);

	return (
		<div>
			<h2>
			Add identifiers {helpIconElement}
			</h2>
			<div>
				{
					identifiers.map((identifier, rowId) => (
						<IdentifierRow
							index={rowId}
							// eslint-disable-next-line react/no-array-index-key
							key={rowId}
							typeOptions={identifierTypes}
						/>
					)).toArray()
				}
			</div>
			{addIdentifierVisible && (
				<Row>
					<Col className="text-center" lg={{offset: 4, span: 4}}>
						<Button variant="success" onClick={onAddIdentifier}>
							<FontAwesomeIcon icon={faPlus}/>
							<span>&nbsp;Add identifier</span>
						</Button>
					</Col>
				</Row>
			)}
		</div>
	);
};
IdentifierEditor.displayName = 'IdentifierEditor';
IdentifierEditor.propTypes = {
	addIdentifierVisible: PropTypes.bool.isRequired,
	identifierTypes: PropTypes.array.isRequired,
	identifiers: PropTypes.object.isRequired,
	onAddIdentifier: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	const identifiers = state.get('identifierEditor');
	let visible = true;
	if (identifiers && identifiers.filter(identifier =>
		identifier.get('value') === '' && identifier.get('type') === null).size !== 0) {
		visible = false;
	}
	return {
		addIdentifierVisible: visible,
		identifiers: state.get('identifierEditor')
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onAddIdentifier: () => dispatch(addIdentifierRow())
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(IdentifierEditor);
