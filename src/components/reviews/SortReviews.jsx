import React, { useState, useEffect } from 'react';
import { Button, Box, Input, Flex, Card, Text, Container, Image, Textarea, Spacer, useToast, Heading, Center } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import server from '../../networking'


function SortReviews() {
  return (
      <Tabs mt={8} variant="soft-rounded" size='sm' minWidth="310px">
        <TabList justifyContent='center' >
          <Tab><Text>Most Recent</Text></Tab>
          <Tab><Text>Highest Rating</Text></Tab>
          <Tab><Text>Lowest Rating</Text></Tab>
          <Tab><Text>Images</Text></Tab>
        </TabList>
        <TabPanels>
            <TabPanel>
                <p>Most Recent Reviews</p>
            </TabPanel>
            <TabPanel>
                <p>Highest Rating Reviews</p>
            </TabPanel>
            <TabPanel>
                <p>Lowest Rating Reviews</p>
            </TabPanel>
            <TabPanel>
                <p>Images Reviews</p>
            </TabPanel>
        </TabPanels>
      </Tabs>
  )
}

export default SortReviews