import { CheckCircleIcon, InfoCircleIcon } from '@patternfly/react-icons';
import React from 'react';
import { global_success_color_100 as okColor } from '@patternfly/react-tokens';
import { TextList, TextListItem, TextContent } from '@patternfly/react-core';
import {
  FeatureId,
  FeatureIdToSupportLevel,
  PreviewSupportLevel,
  isPreviewSupportLevel,
} from '../../../common/types';
import { TECH_SUPPORT_LEVEL_LINK } from '../../../common/config/constants';
import ExternalLink from '../../../common/components/ui/ExternalLink';
import { Cluster } from '../../../common/api/types';
import { useFeatureSupportLevel } from '../../../common/components/featureSupportLevels';
import { DetailItem } from '../../../common';
import { getLimitedFeatureSupportLevels } from './utils';

export type SupportLevelSummary = {
  unsupportedVms: boolean;
  featureIds: FeatureId[];
  supportLevel: PreviewSupportLevel;
};

const getFeatureReviewText = (featureId: FeatureId): string => {
  switch (featureId) {
    case 'SNO':
      return 'Install single node OpenShift (SNO)';
    case 'VIP_AUTO_ALLOC':
      return 'Allocate virtual IPs via DHCP server';
    case 'ARM64_ARCHITECTURE':
      return 'Use ARM architecture for the cluster';
    default:
      return featureId;
  }
};

const getPreviewSupportLevelTitle = (supportLevel: PreviewSupportLevel) => {
  if (supportLevel === 'dev-preview') {
    return 'Developer Preview Features';
  }
  return <ExternalLink href={TECH_SUPPORT_LEVEL_LINK}>Technology Preview Features</ExternalLink>;
};

const getPreviewFeatureList = (supportLevelMap: FeatureIdToSupportLevel) => {
  const previewSupportLevels: { [key in PreviewSupportLevel]: FeatureId[] } = {
    'tech-preview': [],
    'dev-preview': [],
  };
  for (const [featureId, supportLevel] of Object.entries(supportLevelMap)) {
    if (!isPreviewSupportLevel(supportLevel)) {
      continue;
    }
    previewSupportLevels[supportLevel].push(featureId as FeatureId);
  }
  let supportLevel: PreviewSupportLevel;
  //Show only one preview support level list, first priority to developer preview features
  if (previewSupportLevels['dev-preview'].length) {
    supportLevel = 'dev-preview';
  } else if (previewSupportLevels['tech-preview'].length) {
    supportLevel = 'tech-preview';
  } else {
    return null;
  }
  const featureList = previewSupportLevels[supportLevel].map((featureId: FeatureId) => (
    <TextListItem key={featureId}>{getFeatureReviewText(featureId)}</TextListItem>
  ));
  return (
    <>
      <TextListItem>
        {getPreviewSupportLevelTitle(supportLevel)}
        <TextList>{featureList}</TextList>
      </TextListItem>
    </>
  );
};

type LimitedSupportedClusterProps = {
  clusterFeatureSupportLevels: FeatureIdToSupportLevel;
};

export const LimitedSupportedCluster: React.FC<LimitedSupportedClusterProps> = ({
  clusterFeatureSupportLevels,
}) => (
  <TextContent>
    <InfoCircleIcon size="sm" color="var(--pf-global--info-color--100)" />
    &nbsp;Your cluster will be subject to support limitations because it includes:
    <TextList>
      {getPreviewFeatureList(clusterFeatureSupportLevels)}
      {clusterFeatureSupportLevels['CLUSTER_MANAGED_NETWORKING_WITH_VMS'] === 'unsupported' && (
        <TextListItem>
          Cluster-managed networking with some or all discovered hosts as virtual machines
        </TextListItem>
      )}
    </TextList>
  </TextContent>
);

export const FullySupportedCluster: React.FC = () => (
  <>
    <CheckCircleIcon color={okColor.value} />
    &nbsp;Your installed cluster will be fully supported
  </>
);

export const getFeatureSupportLevelTitle = (fullySupported: boolean): string => {
  const supportLevel: string = fullySupported ? 'Full' : 'Limited';
  return `Cluster support level: ${supportLevel}`;
};

export const ClusterFeatureSupportLevelsDetailItem: React.FC<{ cluster: Cluster }> = ({
  cluster,
}) => {
  const featureSupportLevelData = useFeatureSupportLevel();

  const clusterFeatureSupportLevels = React.useMemo(() => {
    return getLimitedFeatureSupportLevels(cluster, featureSupportLevelData);
  }, [cluster, featureSupportLevelData]);

  const fullySupported: boolean = React.useMemo<boolean>(() => {
    return !!clusterFeatureSupportLevels && Object.keys(clusterFeatureSupportLevels).length === 0;
  }, [clusterFeatureSupportLevels]);
  if (clusterFeatureSupportLevels) {
    return (
      <DetailItem
        title={getFeatureSupportLevelTitle(fullySupported)}
        value={
          fullySupported ? (
            <FullySupportedCluster />
          ) : (
            <LimitedSupportedCluster clusterFeatureSupportLevels={clusterFeatureSupportLevels} />
          )
        }
        testId="feature-support-levels"
      />
    );
  }
  return null;
};

export default ClusterFeatureSupportLevelsDetailItem;
