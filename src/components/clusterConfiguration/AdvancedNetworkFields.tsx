import React from 'react';
import { TextInputTypes } from '@patternfly/react-core';
import { useFormikContext } from 'formik';
import { InputField, TextAreaField } from '../ui/formik';
import { ClusterConfigurationValues } from '../../types/clusters';
import { Address6 } from 'ip-address';
import { PREFIX_MAX_RESTRICTION } from '../../config/constants';
import { trimCommaSeparatedList } from '../ui/formik/utils';

const AdvancedNetworkFields: React.FC = () => {
  const { setFieldValue, values } = useFormikContext<ClusterConfigurationValues>();
  const clusterNetworkCidrPrefix = parseInt((values.clusterNetworkCidr || '').split('/')[1]) || 1;

  const formatClusterNetworkHostPrefix = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(parseInt(e.target.value))) {
      setFieldValue('clusterNetworkHostPrefix', clusterNetworkCidrPrefix);
    }
  };

  const formatAdditionalNtpSource = () => {
    if (values.additionalNtpSource) {
      setFieldValue('additionalNtpSource', trimCommaSeparatedList(values.additionalNtpSource));
    }
  };

  const isClusterCIDRIPv6 = Address6.isValid(values.clusterNetworkCidr || '');

  const clusterNetworkHostPrefixHelperText = isClusterCIDRIPv6
    ? 'The subnet prefix length to assign to each individual node. For example, if Cluster Network Host Prefix is set to 116, then each node is assigned a /116 subnet out of the given cidr (clusterNetworkCIDR), which allows for 4,094 (2^(128 - 116) - 2) pod IPs addresses. If you are required to provide access to nodes from an external network, configure load balancers and routers to manage the traffic.'
    : 'The subnet prefix length to assign to each individual node. For example, if Cluster Network Host Prefix is set to 23, then each node is assigned a /23 subnet out of the given cidr (clusterNetworkCIDR), which allows for 510 (2^(32 - 23) - 2) pod IPs addresses. If you are required to provide access to nodes from an external network, configure load balancers and routers to manage the traffic.';

  return (
    <>
      <InputField
        name="clusterNetworkCidr"
        label="Cluster Network CIDR"
        helperText="IP address block from which Pod IPs are allocated This block must not overlap with existing physical networks. These IP addresses are used for the Pod network, and if you need to access the Pods from an external network, configure load balancers and routers to manage the traffic."
        isRequired
      />
      <InputField
        name="clusterNetworkHostPrefix"
        label="Cluster Network Host Prefix"
        type={TextInputTypes.number}
        min={clusterNetworkCidrPrefix}
        max={isClusterCIDRIPv6 ? PREFIX_MAX_RESTRICTION.IPv6 : PREFIX_MAX_RESTRICTION.IPv4}
        onBlur={(e) => formatClusterNetworkHostPrefix(e as React.ChangeEvent<HTMLInputElement>)}
        helperText={clusterNetworkHostPrefixHelperText}
        isRequired
      />
      <InputField
        name="serviceNetworkCidr"
        label="Service Network CIDR"
        helperText="The IP address pool to use for service IP addresses. You can enter only one IP address pool. If you need to access the services from an external network, configure load balancers and routers to manage the traffic."
        isRequired
      />
      <TextAreaField
        name="additionalNtpSource"
        label="Additional NTP Sources"
        helperText="A comma separated list of IP or domain names of the NTP pools or servers. Additional NTP sources are added to all hosts to ensure all hosts clocks are synchronized with a valid NTP server."
        onBlur={formatAdditionalNtpSource}
        spellCheck={false}
      />
    </>
  );
};

export default AdvancedNetworkFields;
