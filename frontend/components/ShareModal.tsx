'use client';

import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { createTodoList } from '@/utils/api';
import { updateTodoList } from '@/utils/api';

export default function ShareModal({ todos, onClose, listId, allowEditing }) {
  const [password, setPassword] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [allowEdit, setAllowEdit] = useState(allowEditing);
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      // Update the existing TODO list on the backend with sharing options
      await updateTodoList(listId, todos, allowEdit, password);

      // Generate the shareable link using the existing listId
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/shared/${listId}`;
      setShareLink(link);
    } catch (error) {
      console.error('Error sharing TODO list:', error);
      toast({ description: 'Failed to generate shareable link.' });
    }
  };

  const showToast = (message) => {
    toast({
      description: message,
    });
  };

  return (
    <Modal isOpen onClose={onClose}>
      <ModalHeader>Share Your TODO List</ModalHeader>
      <ModalBody>
        {!shareLink ? (
          <>
            <p className="mb-2">Optionally set a password to protect your TODO list:</p>
            <Input
              type="password"
              placeholder="Password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-2"
            />
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={allowEdit}
                onChange={(e) => setAllowEdit(e.target.checked)}
                className="mr-2"
              />
              <label>Allow editing</label>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-2">Your shareable link:</p>
            <div className="flex items-center">
              <Input value={shareLink} readOnly className="mr-2" />
              <CopyToClipboard
                text={shareLink}
                onCopy={() => showToast('Link copied to clipboard!')}
              >
                <Button>Copy</Button>
              </CopyToClipboard>
            </div>
          </motion.div>
        )}
      </ModalBody>
      <ModalFooter>
        {!shareLink ? (
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleShare}>Generate Link</Button>
          </>
        ) : (
          <Button onClick={onClose}>Close</Button>
        )}
      </ModalFooter>
    </Modal>
  );
}