      await updateDoc(sessionRef, {
        currentStep: 'waiting_for_token',
        testResults: testResult,
        messages: [
          { type: 'ai', content: "Model tested successfully. Preparing for deployment...", timestamp: new Date().toISOString() },
          { type: 'ai', content: "Please enter your Hugging Face token:", timestamp: new Date().toISOString() }
        ]
      });

      // Wait for user to provide token - deployment will be handled by chat interface
