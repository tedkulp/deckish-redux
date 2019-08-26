import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Formik, Field } from 'formik';
import { TextField, Select } from 'formik-material-ui';
import { makeStyles } from '@material-ui/core/styles';
import { get, merge } from 'lodash';

import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
  field: {
    marginBottom: '1em'
  },
  container: {
    padding: '1em',
    width: 350
  },
  editLayoutButton: {
    marginTop: theme.spacing(2)
  },
  expandedHeader: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  expandedDetails: {
    display: 'inherit',
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  }
}));

const defaultButton = {
  name: '',
  type: '',
  sceneName: '',
  returnSceneName: '',
  sourceName: '',
  key: '',
  modifiers: []
};

const hasSceneName = ({ type = '' }) => {
  return (
    type === 'switch' || type === 'toggle' || type === 'momentary' || type === 'toggleSceneSource'
  );
};

const hasSourceName = ({ type = '' }) => {
  return type === 'toggleSceneSource';
};

const hasReturnSceneName = ({ type = '' }) => {
  return type === 'toggle' || type === 'momentary';
};

const hasBindKey = ({ type = '' }) => {
  return type === 'bindKey';
};

const hasLayout = ({ type = '' }) => {
  return type === 'momentary';
};

const hasActiveImage = ({ type = '' }) => {
  return (
    type === 'switch' ||
    type === 'toggle' ||
    type === 'toggleSource' ||
    type === 'toggleSceneSource' ||
    type === 'momentary'
  );
};

export default () => {
  const classes = useStyles();
  const currentIndex = useStoreState(state => state.currentIndex);
  const scenes = useStoreState(state => state.scenes || []);
  const currentButton = useStoreState(state => merge({}, defaultButton, state.currentButton));
  const clearCurrentIndex = useStoreActions(actions => actions.clearCurrentIndex);
  const addToEditingLayoutNames = useStoreActions(actions => actions.addToEditingLayoutNames);

  const editNestedLayout = index => {
    addToEditingLayoutNames(index);
    clearCurrentIndex();
  };

  const getSourceNames = sceneName => {
    const sceneObj = scenes.find(s => s.name === sceneName);
    return get(sceneObj, 'sources', []);
  };

  return (
    <Drawer open={!!currentIndex} onClose={clearCurrentIndex} anchor="right">
      <div className={classes.container}>
        <Formik initialValues={currentButton}>
          {({ handleSubmit, values }) => (
            <form onSubmit={handleSubmit}>
              <Field
                name="name"
                label="Name"
                component={TextField}
                fullWidth
                className={classes.field}
              />
              <FormControl className={classes.field} fullWidth>
                <InputLabel htmlFor="type" shrink>
                  Type
                </InputLabel>
                <Field name="type" select fullWidth displayEmpty component={Select}>
                  <MenuItem value="">-- Select a Type --</MenuItem>
                  <MenuItem value="switch">Switch Scene</MenuItem>
                  <MenuItem value="toggle">Toggle Scene</MenuItem>
                  <MenuItem value="toggleSource">Toggle Source</MenuItem>
                  <MenuItem value="toggleSceneSource">Toggle Scene Source</MenuItem>
                  <MenuItem value="momentary">Momentary</MenuItem>
                  <MenuItem value="cycle">Cycle (Not Implemented)</MenuItem>
                  <MenuItem value="bindKey">Global Keypress</MenuItem>
                  <MenuItem value="previewTransition">Preview -&gt; Program</MenuItem>
                  <MenuItem value="toggleStudio">Toggle Studio Mode</MenuItem>
                </Field>
              </FormControl>
              {hasSceneName(values) && (
                <FormControl className={classes.field} fullWidth>
                  <InputLabel htmlFor="sceneName">Scene Name</InputLabel>
                  <Field name="sceneName" select fullWidth component={Select}>
                    {scenes.map(scene => (
                      <MenuItem key={`sceneName-${scene.name}`} value={scene.name}>
                        {scene.name}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              )}
              {hasReturnSceneName(values) && (
                <FormControl className={classes.field} fullWidth>
                  <InputLabel htmlFor="returnSceneName">Return Scene Name</InputLabel>
                  <Field name="returnSceneName" select fullWidth component={Select}>
                    <MenuItem value="[previousScene]">[Previous Scene]</MenuItem>
                    {scenes.map(scene => (
                      <MenuItem key={`sceneName-${scene.name}`} value={scene.name}>
                        {scene.name}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              )}
              {hasSourceName(values) && (
                <FormControl className={classes.field} fullWidth>
                  <InputLabel htmlFor="sourceName">Source Name</InputLabel>
                  <Field name="sourceName" select fullWidth component={Select}>
                    {getSourceNames(get(values, 'sceneName')).map(source => (
                      <MenuItem key={`sourceName-${source.name}`} value={source.name}>
                        {source.name}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              )}
              {hasBindKey(values) && (
                <React.Fragment>
                  <Field
                    name="key"
                    label="Key"
                    component={TextField}
                    fullWidth
                    className={classes.field}
                  />
                  <FormControl className={classes.field} fullWidth>
                    <InputLabel htmlFor="modifiers">Modifiers</InputLabel>
                    <Field name="modifiers" select fullWidth component={Select} multiple>
                      <MenuItem value="alt">Alt</MenuItem>
                      <MenuItem value="ctrl">Control</MenuItem>
                      <MenuItem value="shift">Shift</MenuItem>
                    </Field>
                  </FormControl>
                </React.Fragment>
              )}
              {hasActiveImage(values) && (
                <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    className={classes.expandedHeader}
                  >
                    <Typography>Active Image</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.expandedDetails}>
                    <FormControl className={classes.field} fullWidth>
                      <InputLabel htmlFor="visual.active.type">Type</InputLabel>
                      <Field name="visual.active.type" select fullWidth component={Select}>
                        <MenuItem value="image">Image</MenuItem>
                        <MenuItem value="color">Color</MenuItem>
                      </Field>
                    </FormControl>
                    <FormControl className={classes.field} fullWidth>
                      <InputLabel htmlFor="visual.active.backgroundImage">Image</InputLabel>
                      <Field
                        name="visual.active.backgroundImage"
                        select
                        fullWidth
                        component={Select}
                      >
                        <MenuItem value="./images/crossbones.png">./images/crossbones.png</MenuItem>
                        <MenuItem value="./images/crossbones-white.png">
                          ./images/crossbones-white.png
                        </MenuItem>
                        <MenuItem value="./images/folder.png">./images/folder.png</MenuItem>
                        <MenuItem value="./images/gears.png">./images/gears.png</MenuItem>
                        <MenuItem value="./images/pause.png">./images/pause.png</MenuItem>
                        <MenuItem value="./images/scene.png">./images/scene.png</MenuItem>
                      </Field>
                    </FormControl>
                    <Field
                      name="visual.active.color"
                      label="Color"
                      component={TextField}
                      fullWidth
                      className={classes.field}
                    />
                    <Field
                      name="visual.active.text"
                      label="Text"
                      component={TextField}
                      fullWidth
                      className={classes.field}
                    />
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              )}
              <ExpansionPanel>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  className={classes.expandedHeader}
                >
                  <Typography>Inactive Image</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.expandedDetails}>
                  <FormControl className={classes.field} fullWidth>
                    <InputLabel htmlFor="visual.inactive.type">Type</InputLabel>
                    <Field name="visual.inactive.type" select fullWidth component={Select}>
                      <MenuItem value="image">Image</MenuItem>
                      <MenuItem value="color">Color</MenuItem>
                    </Field>
                  </FormControl>
                  <FormControl className={classes.field} fullWidth>
                    <InputLabel htmlFor="visual.inactive.backgroundImage">Image</InputLabel>
                    <Field
                      name="visual.inactive.backgroundImage"
                      select
                      fullWidth
                      component={Select}
                    >
                      <MenuItem value="./images/crossbones.png">./images/crossbones.png</MenuItem>
                      <MenuItem value="./images/crossbones-white.png">
                        ./images/crossbones-white.png
                      </MenuItem>
                      <MenuItem value="./images/folder.png">./images/folder.png</MenuItem>
                      <MenuItem value="./images/gears.png">./images/gears.png</MenuItem>
                      <MenuItem value="./images/pause.png">./images/pause.png</MenuItem>
                      <MenuItem value="./images/scene.png">./images/scene.png</MenuItem>
                    </Field>
                  </FormControl>
                  <Field
                    name="visual.inactive.color"
                    label="Color"
                    component={TextField}
                    fullWidth
                    className={classes.field}
                  />
                  <Field
                    name="visual.inactive.text"
                    label="Text"
                    component={TextField}
                    fullWidth
                    className={classes.field}
                  />
                </ExpansionPanelDetails>
              </ExpansionPanel>
              {hasLayout(values) && (
                <Button
                  onClick={() => editNestedLayout(currentIndex)}
                  className={classes.editLayoutButton}
                >
                  Edit Nested Layout
                </Button>
              )}
            </form>
          )}
        </Formik>
      </div>
    </Drawer>
  );
};
