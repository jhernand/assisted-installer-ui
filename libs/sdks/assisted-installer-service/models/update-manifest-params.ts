/* tslint:disable */
/* eslint-disable */
/**
 * AssistedInstall
 * Assisted installation
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @interface UpdateManifestParams
 */
export interface UpdateManifestParams {
  /**
   * The file name for the manifest to modify.
   * @type {string}
   * @memberof UpdateManifestParams
   */
  file_name: string;
  /**
   * The folder for the manifest to modify.
   * @type {string}
   * @memberof UpdateManifestParams
   */
  folder: UpdateManifestParamsFolderEnum;
  /**
   * The new base64 encoded manifest content.
   * @type {string}
   * @memberof UpdateManifestParams
   */
  updated_content?: string | null;
  /**
   * The new file name for the manifest.
   * @type {string}
   * @memberof UpdateManifestParams
   */
  updated_file_name?: string | null;
  /**
   * The new folder for the manifest. Manifests can be placed in \'manifests\' or \'openshift\' directories.
   * @type {string}
   * @memberof UpdateManifestParams
   */
  updated_folder?: UpdateManifestParamsUpdatedFolderEnum;
}

/**
 * @export
 * @enum {string}
 */
export enum UpdateManifestParamsFolderEnum {
  Manifests = 'manifests',
  Openshift = 'openshift',
}
/**
 * @export
 * @enum {string}
 */
export enum UpdateManifestParamsUpdatedFolderEnum {
  Manifests = 'manifests',
  Openshift = 'openshift',
}