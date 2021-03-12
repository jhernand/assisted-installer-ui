import React from 'react';
import { useDispatch } from 'react-redux';
import {
  AlertActionLink,
  Button,
  Modal,
  ModalVariant,
  ButtonVariant,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { ToolbarButton } from '../ui/Toolbar';
import { postResetCluster } from '../../api/clusters';
import { Cluster } from '../../api/types';
import { getErrorMessage, handleApiError } from '../../api/utils';
import LoadingState from '../ui/uiState/LoadingState';
import ErrorState from '../ui/uiState/ErrorState';
import { updateCluster } from '../../features/clusters/currentClusterSlice';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { global_warning_color_100 as warningColor } from '@patternfly/react-tokens';
import { calculateCollectedLogsCount } from '../clusters/utils';

type ResetClusterModalButtonProps = React.ComponentProps<typeof Button> & {
  ButtonComponent?: typeof Button | typeof ToolbarButton | typeof AlertActionLink;
  clusterId: Cluster['id'];
};

type ResetClusterModalProps = {
  onClose: () => void;
  isOpen: boolean;
  cluster: Cluster;
};

const ResetClusterModal: React.FC<ResetClusterModalProps> = ({ onClose, isOpen, cluster }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<{ title: string; message: string } | null>(null);

  const handleClose = () => {
    setIsSubmitting(false);
    setError(null);
    onClose();
  };

  const handleReset = async () => {
    setIsSubmitting(true);
    try {
      setError(null);
      const { data } = await postResetCluster(cluster.id);
      dispatch(updateCluster(data));
      onClose();
    } catch (e) {
      handleApiError(e, () => {
        setError({ title: 'Failed to reset cluster installation', message: getErrorMessage(e) });
      });
    }
    setIsSubmitting(false);
  };

  const collectedLogsRatio = `${calculateCollectedLogsCount(cluster)}/${
    (cluster.hosts?.length || 0) + 1
  }`;

  const getModalContent = () => {
    if (isSubmitting) {
      return <LoadingState content="Resetting cluster installation..." />;
    }

    if (error) {
      return <ErrorState title={error.title} content={error.message} />;
    }

    return (
      <TextContent>
        <Text component="p">
          This will reset the installation and return to the cluster configuration. Some hosts may
          need to be re-registered by rebooting into the Discovery ISO.
        </Text>

        <Text component="p">
          <strong>Download the installation logs</strong> to troubleshoot or report a bug.
          <br />
          Currently, {collectedLogsRatio} installation logs were collected and are ready for
          download.
        </Text>

        <Text component="p">
          <ExclamationTriangleIcon className="status-icon" color={warningColor.value} size="sm" />{' '}
          Logs won't be available after the installation is reset.
        </Text>

        <Text component="p">Are you sure you want to reset the cluster?</Text>
      </TextContent>
    );
  };

  const actions = [
    <Button
      key="reset"
      variant={ButtonVariant.danger}
      onClick={handleReset}
      isDisabled={isSubmitting}
    >
      Reset Cluster
    </Button>,
  ];

  actions.push(
    <Button
      key="cancel"
      variant={ButtonVariant.link}
      onClick={handleClose}
      isDisabled={isSubmitting}
    >
      Cancel
    </Button>,
  );

  return (
    <Modal
      title="Reset Cluster Installation"
      isOpen={isOpen}
      variant={ModalVariant.small}
      actions={actions}
      onClose={handleClose}
    >
      {getModalContent()}
    </Modal>
  );
};

export default ResetClusterModal;
