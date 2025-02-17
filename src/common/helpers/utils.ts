import {Relationship, RelationshipForDisplay} from '../../client/entity-editor/relationship-editor/types';

import {kebabCase} from 'lodash';

/**
 * Regular expression for valid BookBrainz UUIDs (bbid)
 *
 * @private
 */
const _bbidRegex =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/**
 * Tests if a BookBrainz UUID is valid
 *
 * @param {string} bbid - BookBrainz UUID to validate
 * @returns {boolean} - Returns true if BookBrainz UUID is valid
 */
export function isValidBBID(bbid: string): boolean {
	return _bbidRegex.test(bbid);
}

/**
 * Returns all entity models defined in bookbrainz-data-js
 *
 * @param {object} orm - the BookBrainz ORM, initialized during app setup
 * @returns {object} - Object mapping model name to the entity model
 */
export function getEntityModels(orm: any) {
	const {Author, Edition, EditionGroup, Publisher, Series, Work} = orm;
	return {
		Author,
		Edition,
		EditionGroup,
		Publisher,
		Series,
		Work
	};
}

/**
 * Retrieves the Bookshelf entity model with the given the model name
 *
 * @param {object} orm - the BookBrainz ORM, initialized during app setup
 * @param {string} type - Name or type of model
 * @throws {Error} Throws a custom error if the param 'type' does not
 * map to a model
 * @returns {object} - Bookshelf model object with the type specified in the
 * single param
 */
export function getEntityModelByType(orm: any, type: string): any {
	const entityModels = getEntityModels(orm);

	if (!entityModels[type]) {
		throw new Error(`Unrecognized entity type: '${type}'`);
	}

	return entityModels[type];
}

/**
 * This function maps `{a: somePromise}` to a promise that
 * resolves with `{a: resolvedValue}`.
 * @param {object} obj - an object with Promises as values
 * @returns {Promise<object>} - A Promise resolving to the object with resolved values
 */
type Unresolved<T> = {
	[P in keyof T]: Promise<T[P]>;
};
export function makePromiseFromObject<T>(obj: Unresolved<T>): Promise<T> {
	const keys = Object.keys(obj);
	const values = Object.values(obj);
	return Promise.all(values)
	  .then(resolved => {
			const res = {};
			for (let i = 0; i < keys.length; i += 1) {
				res[keys[i]] = resolved[i];
			}
			return res as T;
	  });
}

/**
 * This function sorts the relationship array
 * @param {string} sortByProperty - name of property which will be used for sorting
 * @returns {array} - sorted relationship array
 */
export function sortRelationshipOrdinal(sortByProperty: string) {
	return (a: RelationshipForDisplay | Relationship, b: RelationshipForDisplay | Relationship) => {
		const value1 = a[sortByProperty] || '';
		const value2 = b[sortByProperty] || '';
		// eslint-disable-next-line no-undefined
		return value1.localeCompare(value2, undefined, {numeric: true});
	};
}


/**
 * Returns an API path for interacting with the given Bookshelf entity model
 *
 * @param {object} entity - Entity object
 * @returns {string} - URL path to interact with entity
 */
export function getEntityLink(entity: {type: string, bbid: string}): string {
	return `/${kebabCase(entity.type)}/${entity.bbid}`;
}


export function getNextEnabledAndResultsArray(array, size) {
	if (array.length > size) {
		while (array.length > size) {
			array.pop();
		}
		return {
			newResultsArray: array,
			nextEnabled: true
		};
	}
	return {
		newResultsArray: array,
		nextEnabled: false
	};
}
