import React from 'react';
// import { get } from 'lodash';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Formik, Field } from 'formik';
import { TextField, Select } from 'formik-material-ui';
import { makeStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles({
  field: {
    marginBottom: '1em'
  },
  container: {
    padding: '1em',
    width: 350
  }
});

const defaultButton = {
  name: '',
  type: 'switch'
};

export default () => {
  const classes = useStyles();
  const currentIndex = useStoreState(state => state.currentIndex);
  const currentButton = useStoreState(state => state.currentButton || defaultButton);
  const clearCurrentIndex = useStoreActions(actions => actions.clearCurrentIndex);

  return (
    <Drawer open={!!currentIndex} onClose={clearCurrentIndex} anchor="right">
      <div className={classes.container}>
        <Formik initialValues={currentButton}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Field
                name="name"
                label="Name"
                component={TextField}
                fullWidth
                className={classes.field}
              />
              <FormControl className={classes.field} fullWidth>
                <InputLabel htmlFor="type">Type</InputLabel>
                <Field name="type" select fullWidth component={Select}>
                  <MenuItem value="switch">Switch Scene</MenuItem>
                  <MenuItem value="toggle">Toggle Scene</MenuItem>
                  <MenuItem value="toggleSource">Toggle Source</MenuItem>
                  <MenuItem value="toggleSceneSource">Toggle Scene Source</MenuItem>
                  <MenuItem value="momentary">Momentary</MenuItem>
                  <MenuItem value="cycle">Cycle (Not Implemented)</MenuItem>
                  <MenuItem value="bindKey">Global Keypress</MenuItem>
                  <MenuItem value="toggleStudio">Toggle Studio Mode</MenuItem>
                  <MenuItem value="previewTransition">Transition</MenuItem>
                </Field>
              </FormControl>
            </form>
          )}
        </Formik>
      </div>
    </Drawer>
  );
};
